-- New (Clean Database)

-- database name: "seed_to_feed"

CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(80) NOT NULL UNIQUE,
	"password" varchar(1000) NOT NULL,
	"farmer" BOOLEAN NOT NULL,
	"buyer" BOOLEAN NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"super_admin" BOOLEAN DEFAULT FALSE,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "field" (
	"id" serial NOT NULL,
	"year" INT,
	"location" TEXT,
	"acres" FLOAT,
	"field_note" TEXT,
	"name" varchar(255),
	"image" VARCHAR(255),
	"shape_file" TEXT,
	"gmo" BOOLEAN,
	"crop_id" integer NOT NULL,
	CONSTRAINT "field_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "crop" (
	"id" serial NOT NULL,
	"crop_type" varchar(255) NOT NULL,
	CONSTRAINT "crop_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "transaction_type" (
	"id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"workflow_images" varchar(255),
	CONSTRAINT "transaction_type_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "contract" (
	"id" serial NOT NULL,
	"buyer_id" integer,
	"user_field_id" integer NOT NULL,
	"commodity" integer NOT NULL,
	"open_status" integer NOT NULL,
	"bushel_uid" VARCHAR(255),
	"quantity_fulfilled" FLOAT,
	"price" FLOAT,
	"protein" FLOAT,
	"oil" FLOAT,
	"moisture" FLOAT,
	"contract_quantity" FLOAT,
	"container_serial" integer,
	"contract_handler" varchar(255),
	CONSTRAINT "contract_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "NIR" (
	"id" serial NOT NULL,
	"field_id" integer NOT NULL,
	"oil" FLOAT,
	"moisture" FLOAT,
	"protein" FLOAT,
	"energy" FLOAT,
	"amino_acids" FLOAT,
	"tested_at" TIMESTAMP,
	CONSTRAINT "NIR_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "field_transactions" (
	"id" serial NOT NULL,
	"field_id" integer NOT NULL,
	"timestamp" TIMESTAMP, -- Need to be fixed to be brought in as timestamp with timezone
	"status_notes" TEXT,
	"image" varchar(255),
	"field_status" TEXT,
	"transaction_type" integer DEFAULT 1,
	CONSTRAINT "field_transactions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "user_field" (
	"id" serial NOT NULL,
	"field_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "user_field_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "buyer_field" (
	"id" serial NOT NULL,
	"field_id" integer NOT NULL,
	"buyer_id" integer NOT NULL,
	CONSTRAINT "buyer_field_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "arbitrary_data" (
	"id" serial NOT NULL,
	"key" varchar(255),
	"value" varchar(255),
	"field_trans_id" integer NOT NULL,
	CONSTRAINT "arbitrary_data_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "contract_status" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "contract_status_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "stream" (
"id" SERIAL PRIMARY KEY,
"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
"source" VARCHAR(50) NOT NULL,
"stream_type" VARCHAR(50) NOT NULL DEFAULT 'unknown',
"raw" JSONB
);

ALTER TABLE "field" ADD CONSTRAINT "field_fk0" FOREIGN KEY ("crop_id") REFERENCES "crop"("id") ON DELETE CASCADE;
ALTER TABLE "contract" ADD CONSTRAINT "contract_fk0" FOREIGN KEY ("user_field_id") REFERENCES "user_field"("id") ON DELETE CASCADE;
ALTER TABLE "contract" ADD CONSTRAINT "contract_fk1" FOREIGN KEY ("commodity") REFERENCES "crop"("id") ON DELETE CASCADE;
ALTER TABLE "contract" ADD CONSTRAINT "contract_fk2" FOREIGN KEY ("open_status") REFERENCES "contract_status"("id") ON DELETE CASCADE;
ALTER TABLE "NIR" ADD CONSTRAINT "NIR_fk0" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE;
ALTER TABLE "field_transactions" ADD CONSTRAINT "field_transactions_fk0" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE;
ALTER TABLE "field_transactions" ADD CONSTRAINT "field_transactions_fk1" FOREIGN KEY ("transaction_type") REFERENCES "transaction_type"("id") ON DELETE CASCADE;
ALTER TABLE "user_field" ADD CONSTRAINT "user_field_fk0" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE;
ALTER TABLE "user_field" ADD CONSTRAINT "user_field_fk1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "arbitrary_data" ADD CONSTRAINT "arbitrary_data_fk0" FOREIGN KEY ("field_trans_id") REFERENCES "field_transactions"("id") ON DELETE CASCADE;
ALTER TABLE "buyer_field" ADD CONSTRAINT "buyer_field_fk0" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE;
ALTER TABLE "buyer_field" ADD CONSTRAINT "buyer_field_fk1" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "contract" ADD CONSTRAINT "contract_fk3" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;

-- Crop Drop Setup
INSERT INTO "crop" (crop_type) VALUES ('Barley'), ('Corn'), ('Oats'), ('Soybeans'), ('Sugarbeets'), ('Wheat');
INSERT INTO "contract_status" ("name") VALUES ('Created'), ('Pending'), ('Signed'), ('Delivered'), ('Paid'), ('Fulfilled');

INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('1', 'pre-planting', '/images/001.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('2', 'plant', '/images/002.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('3', 'application', '/images/003.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('4', 'harvest_farm', '/images/004.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('5', 'elevator_transit', '/images/005.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('6', 'elevator', '/images/006.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('7', 'processing', '/images/007.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('8', 'transit', '/images/008.png');
INSERT INTO "transaction_type" ("id", "name", "workflow_images") VALUES ('9', 'feed', '/images/009.png');
INSERT INTO "transaction_type" ("id", "name") VALUES ('10', 'contract');

INSERT INTO "field_transactions" ("field_id", "timestamp", "status_notes", "image", "field_status", "transaction_type") VALUES ('1', '04-24-2021', 'fertilizer', 'none', 'pre-planting', '3');