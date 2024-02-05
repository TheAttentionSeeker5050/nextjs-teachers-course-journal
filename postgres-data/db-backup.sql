-- Adminer 4.8.1 PostgreSQL 16.1 dump

DROP TABLE IF EXISTS "courses";
DROP SEQUENCE IF EXISTS courses_id_seq;
CREATE SEQUENCE courses_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."courses" (
    "id" integer DEFAULT nextval('courses_id_seq') NOT NULL,
    "courseName" text NOT NULL,
    "userId" integer NOT NULL,
    "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "lessons";
DROP SEQUENCE IF EXISTS lessons_id_seq;
CREATE SEQUENCE lessons_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."lessons" (
    "id" integer DEFAULT nextval('lessons_id_seq') NOT NULL,
    "lessonName" text NOT NULL,
    "lessonNumber" integer NOT NULL,
    "completionStatus" text DEFAULT 'not prepped' NOT NULL,
    "epectedOutcomes" text,
    "assessment" text,
    "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "unitId" integer NOT NULL,
    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "units";
DROP SEQUENCE IF EXISTS units_id_seq;
CREATE SEQUENCE units_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."units" (
    "id" integer DEFAULT nextval('units_id_seq') NOT NULL,
    "unitNumber" integer NOT NULL,
    "unitName" text NOT NULL,
    "courseId" integer NOT NULL,
    "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "email" text NOT NULL,
    "password" text NOT NULL,
    "firstName" text,
    "lastName" text,
    "title" text,
    "organization" text,
    "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_email_key" UNIQUE ("email"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "users" ("id", "email", "password", "firstName", "lastName", "title", "organization", "dateCreated", "dateUpdated") VALUES
(1,	'iamseverous@hogwardsschoolofmagic.com',	'krivireioeroiuheroigureigouergfneroiguerogiuerb',	'Severous',	'Snape',	'Defense Against the Dark Arts',	'Hogwards',	'2024-01-25 21:11:44.275',	'2024-01-25 21:11:44.275');

ALTER TABLE ONLY "public"."courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."lessons" ADD CONSTRAINT "lessons_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES units(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."units" ADD CONSTRAINT "units_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- -- Adminer 4.8.1 PostgreSQL 16.1 dump

-- DROP TABLE IF EXISTS "courses";
-- DROP SEQUENCE IF EXISTS courses_id_seq;
-- CREATE SEQUENCE courses_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

-- CREATE TABLE "public"."courses" (
--     "id" integer DEFAULT nextval('courses_id_seq') NOT NULL,
--     "courseName" text NOT NULL,
--     "userId" integer NOT NULL,
--     CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);


-- DROP TABLE IF EXISTS "users";
-- DROP SEQUENCE IF EXISTS users_id_seq;
-- CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

-- CREATE TABLE "public"."users" (
--     "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
--     "email" text NOT NULL,
--     "password" text NOT NULL,
--     "firstName" text,
--     "lastName" text,
--     "title" text,
--     "organization" text,
--     "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     "dateUpdated" timestamp(3),
--     CONSTRAINT "users_email_key" UNIQUE ("email"),
--     CONSTRAINT "users_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);

-- INSERT INTO "users" ("id", "email", "password", "firstName", "lastName", "title", "organization", "dateCreated", "dateUpdated") VALUES
-- (1,	'iamseverous@hogwardsschoolofmagic.com',	'krivireioeroiuheroigureigouergfneroiguerogiuerb',	'Severous',	'Snape',	'Defense Against the Dark Arts',	'Hogwards',	'2024-01-25 21:11:44.275',	'2024-01-25 21:11:44.275');

-- ALTER TABLE ONLY "public"."courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

-- -- 2024-01-26 18:35:40.330427+00