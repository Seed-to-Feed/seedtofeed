const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
   rejectUnauthenticated
} = require('../modules/authentication-middleware');

router.post('/bushel', async (req, res) => {
   // We dont really know yet what incoming data will look like,
   // so just store the raw body directly as JSONB
   //process the incoming req.body to update our contract
   //1. verify that we have contracts req.body
   //2. loop over req.body.data to keep extract ALL contracts
   //3. select bushel_uid from contract table
   //4. compare to find match and update our contract record
   //5. update right in the contract table
   //6. create transaction record on transaction table
   console.log('from postman', req.body);
   // const queryText1 = `SELECT "bushel_uid", "id", "user_field_id" FROM "contract" WHERE "open_status" != 6;`; //6 equals fulfilled
   // // const queryText1 = `SELECT "bushel_uid", "id", "user_field_id" FROM "contract" WHERE "open_status" != (SELECT "id" FROM "field_status" where "name"='fulfilled');`;

   // const bushelContracts = await pool.query(queryText1);
   // console.log('bushel contracts from db', bushelContracts.rows);

   try {
      for (let item of req.body.data) {
         // console.log('bushel contract postman', item.contract);
         // let foundContract = bushelContracts.rows.find(contract => item.contract.id === contract.bushel_uid);

         // const queryText1 = `SELECT "bushel_uid", "id", "user_field_id" FROM "contract" WHERE "bushel_uid"=$1;`; 
         const queryText1 = `
         SELECT "contract"."bushel_uid", "contract"."user_field_id", "contract"."id" AS "contractID", 
         "contract_status"."id" AS "contract_status_ID", "contract_status"."name"
         FROM "contract", "contract_status" 
         WHERE "bushel_uid"=$1;`;
         const bushelContracts = await pool.query(queryText1, item.contract.id);
         let foundContract = bushelContracts[0];
         // console.log('bushel contracts from db', bushelContracts.rows);

         if (!foundContract) {
            console.log(`no contract found for ${item.contract.id}`);
            continue; // if no contract found, theres nothing to process (unless we want to do a new INSERT)
         }
         console.log(`Found bushel contract from db: `, foundContract);

         // Case 1: Contract has been completed
         // item.contract.completed is true, 
         if (item.contract.completed === true && foundContract.name != 'fulfilled') {
            const queryText2 = `UPDATE "contract" SET "open_status" = (SELECT "id" FROM "field_status" where "name"='fulfilled') WHERE "bushel_uid" = $1 RETURNING "id", "user_field_id";`;
            const contractID = await pool.query(queryText2, [foundContract.bushel_uid]);
            console.log('contract table response', contractID.rows);

            const queryText3 = `SELECT "id", "field_id" FROM "user_field" WHERE "id" = $1;`;
            const transactionInsert = await pool.query(queryText3, [foundContract.user_field_id]);
            console.log('transaction insert', transactionInsert.rows);

            const queryText4 = `INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "field_status", "transaction_type")
               VALUES ($1, Now(), 'bushel contract complete', 'elevator', (SELECT "id" FROM "transaction_type" where "name"='elevator'));`;
            const updateTransaction = await pool.query(queryText4, [transactionInsert.rows[0].field_id]);
            console.log(`posted transaction for field: ${transactionInsert.rows[0].field_id}`);
         }
      }

      const queryText = `INSERT INTO "stream" ("source", "stream_type", "raw") VALUES ('bushel', 'unknown', $1) RETURNING *;`
      await pool.query(queryText, [req.body]);

      res.sendStatus(201);
   } catch (error) {
      console.log('Error in updating bushel contract', error);
      res.sendStatus(500);
   }
});


router.get('/', rejectUnauthenticated, async (req, res) => {
   const queryText = `SELECT * FROM "stream" ORDER BY "created_at" DESC`
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
   const queryText = `DELETE FROM "stream";`
   try {
      const result = await pool.query(queryText);
      res.sendStatus(204);
   } catch (err) {
      res.status(500).send(err);
   }
});

module.exports = router;
