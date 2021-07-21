const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.post('/bushel', async (req, res) => {
  console.log('from postman', req.body);

  try {
    for (let item of req.body.data) {
      const queryText1 = `
         SELECT "contract"."id" AS "contractID", "contract"."user_field_id", "contract"."open_status", "contract"."bushel_uid",
         "contract"."quantity_fulfilled", "contract"."contract_quantity", "contract"."container_serial",
         "contract_status"."id" AS "contract_status_ID", "contract_status"."name"
         FROM "contract" JOIN "contract_status" ON ("contract"."open_status" = "contract_status"."id") 
         WHERE "bushel_uid" = $1;`;
      const bushelContracts = await pool.query(queryText1, [item.contract.id]);
      const foundContract = bushelContracts.rows[0];
      console.log('found Contract', foundContract);

      if (!foundContract) {
        console.log(`no contract found for ${item.contract.id}`);
        continue; // if no contract found, theres nothing to process (unless we want to do a new INSERT)
      }

      if (
        item.contract.completed === true &&
        foundContract.name !== 'Fulfilled'
      ) {
        const queryText2 = `UPDATE "contract" SET "open_status" = (SELECT "id" FROM "contract_status" WHERE "name"='Fulfilled') WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [foundContract.bushel_uid]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);
        console.log('transaction insert', transactionInsert.rows[0].field_id);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 
               '${item.contract.company_name} fulfilled ${item.contract.quantity_contracted}-${item.contract.quantity_uom} of ${item.contract.commodity.name}: Contract ${item.contract.id} paid/complete by ${item.contract.elevator_name} ', 
               'elevator', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else if (
        (item.contract.filled === true && foundContract.name === 'Signed') ||
        (item.contract.filled === true && foundContract.name === 'Delivered')
      ) {
        const queryText2 = `
               UPDATE "contract" SET "open_status" = (SELECT "id" FROM "contract_status" WHERE "name"='Delivered'), "quantity_fulfilled" = $2
               WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [
          foundContract.bushel_uid,
          foundContract.contract_quantity,
        ]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 
               '${item.contract.company_name} delivered ${item.contract.quantity_contracted}-${item.contract.quantity_uom} of ${item.contract.commodity.name}: Contract ${item.contract.id} filled. Processing payment: ${item.contract.elevator_name}', 
               'elevator', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else if (
        item.contract.quantity_submitted === foundContract.contract_quantity &&
        foundContract.name === 'Signed'
      ) {
        const percentDelivered = Number(
          (item.contract.quantity_submitted / foundContract.contract_quantity) *
            100
        );

        const queryText2 = `UPDATE "contract" SET "open_status" = (SELECT "id" FROM "contract_status" WHERE "name"='Delivered') WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [foundContract.bushel_uid]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);
        console.log('transaction insert', transactionInsert.rows[0].field_id);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 
               '${item.contract.company_name} delivered ${percentDelivered}% of ${foundContract.contract_quantity}-${item.contract.quantity_uom} of ${item.contract.commodity.name} to ${item.contract.elevator_name}: Processing payment', 
               'elevator', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else if (
        item.contract.quantity_submitted > 0 &&
        foundContract.name === 'Signed'
      ) {
        const quantityDelivered =
          item.contract.quantity_submitted + foundContract.quantity_fulfilled;
        const quantityOutstanding =
          foundContract.contract_quantity - quantityDelivered;
        const queryText2 = `UPDATE "contract" SET "quantity_fulfilled" = $2 WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [
          foundContract.bushel_uid,
          quantityDelivered,
        ]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);
        console.log('transaction insert', transactionInsert.rows[0].field_id);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
                  VALUES ($1, Now(), 
                  '${item.contract.company_name} delivered ${item.contract.quantity_submitted}-${item.contract.quantity_uom} of ${item.contract.commodity.name} to ${item.contract.elevator_name}: ${quantityDelivered}-${item.contract.quantity_uom} in storage container S/N ${foundContract.container_serial}: ${quantityOutstanding}-${item.contract.quantity_uom} remain to fill ${foundContract.contract_quantity}-${item.contract.quantity_uom} order on contract ${item.contract.id}', 
                  'elevator_transit', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator_transit'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else if (foundContract.name === 'Paid') {
        const queryText2 = `UPDATE "contract" SET "open_status" = (SELECT "id" FROM "contract_status" WHERE "name"='Fulfilled') WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [foundContract.bushel_uid]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);
        console.log('transaction insert', transactionInsert.rows[0].field_id);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 
               'Contract ${item.contract.id} for ${item.contract.quantity_contracted}-${item.contract.quantity_uom} of ${item.contract.commodity.name}: paid/complete by ${item.contract.elevator_name}', 
               'elevator', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else if (foundContract.name === 'Created') {
        const queryText2 = `UPDATE "contract" SET "open_status" = (SELECT "id" FROM "contract_status" WHERE "name"='Pending') WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [foundContract.bushel_uid]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);
        console.log('transaction insert', transactionInsert.rows[0].field_id);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 
               'Contract ${item.contract.id} for ${item.contract.quantity_contracted}-${item.contract.quantity_uom} of ${item.contract.commodity.name}: pending by ${item.contract.elevator_name}', 
               'elevator', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else if (foundContract.name === 'Pending') {
        const queryText2 = `UPDATE "contract" SET "open_status" = (SELECT "id" FROM "contract_status" WHERE "name"='Signed') WHERE "bushel_uid" = $1;`;
        await pool.query(queryText2, [foundContract.bushel_uid]);

        const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
        const transactionInsert = await pool.query(queryText3, [
          foundContract.user_field_id,
        ]);
        console.log('transaction insert', transactionInsert.rows[0].field_id);

        const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 
               'Contract ${item.contract.id} for ${item.contract.quantity_contracted}-${item.contract.quantity_uom} of ${item.contract.commodity.name}: signed: ${item.contract.company_name} and ${item.contract.elevator_name}', 
               'elevator', (SELECT "id" FROM "transaction_type" WHERE "name" ='elevator'));`;
        await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
        console.log(
          `posted transaction for field: ${transactionInsert.rows[0].field_id}`
        );
      } else {
        console.log('No conditions were met');
      }
    }

    const queryText = `INSERT INTO "stream" ("source", "stream_type", "raw") VALUES ('bushel', 'unknown', $1) RETURNING *;`;
    await pool.query(queryText, [req.body]);

    res.sendStatus(201);
  } catch (error) {
    console.log('Error in updating bushel contract', error);
    res.sendStatus(500);
  }
});

router.get('/', rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT * FROM "stream" ORDER BY "created_at" DESC`;
  try {
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/', rejectUnauthenticated, async (req, res) => {
  // Clear the entire stream table. Useful for when we reset
  // the Bushel Push API pointer which will re-send all data
  const queryText = `DELETE FROM "stream";`;
  try {
    const result = await pool.query(queryText);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
