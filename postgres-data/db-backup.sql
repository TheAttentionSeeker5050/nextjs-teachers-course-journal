CREATE SEQUENCE courses_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."courses" (
    "id" integer DEFAULT nextval('courses_id_seq') NOT NULL,
    "courseName" text NOT NULL,
    "userId" integer NOT NULL,
    "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "isArchived" boolean DEFAULT false NOT NULL,
    "thumbnail" character varying(250),
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO
    "courses" (
        "courseName", "userId", "dateCreated", "dateUpdated", "isArchived", "thumbnail"
    )
VALUES (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Defence Against the Dark Arts', 1, '2024-02-10 17:50:28.182', '2024-02-10 17:50:28.182', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    ),
    (
        'Potions', 1, '2024-02-10 17:51:44.39', '2024-02-10 17:51:44.39', 'f', NULL
    );

CREATE SEQUENCE fileuploads_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."fileuploads" (
    "id" integer DEFAULT nextval('fileuploads_id_seq') NOT NULL,
    "fileDisplayName" character varying(250) NOT NULL,
    "fileUniqueName" character varying(250) NOT NULL,
    "userId" integer NOT NULL,
    "lessonId" integer NOT NULL,
    CONSTRAINT "fileuploads_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE lessons_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."lessons" (
    "id" integer DEFAULT nextval('lessons_id_seq') NOT NULL,
    "lessonName" text NOT NULL,
    "lessonNumber" integer NOT NULL,
    "completionStatus" text DEFAULT 'not prepped' NOT NULL,
    "expectedOutcomes" text,
    "assessment" text,
    "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "unitId" integer NOT NULL,
    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO
    "lessons" (
        "lessonName", "lessonNumber", "completionStatus", "expectedOutcomes", "assessment", "dateCreated", "dateUpdated", "unitId"
    )
VALUES (
        'Lesson Name 1', 1, 'not prepped', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 13:59:26.841', '2024-02-13 13:59:26.841', 1
    ),
    (
        'Lesson Name 2', 2, 'not prepped', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:00:41.818', '2024-02-13 14:00:41.818', 1
    ),
    (
        'Lesson Name 3', 3, 'prepped', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:01:05.337', '2024-02-13 14:01:05.337', 2
    ),
    (
        'Lesson Name 4', 4, 'done', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:01:22.764', '2024-02-13 14:01:22.764', 2
    ),
    (
        'Lesson Name 5', 5, 'done', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:01:47.124', '2024-02-13 14:01:47.124', 3
    ),
    (
        'Lesson Name 6', 6, 'not prepped', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:02:07.912', '2024-02-13 14:02:07.912', 3
    ),
    (
        'Lesson Name 7', 7, 'done', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:02:39.538', '2024-02-13 14:02:39.538', 4
    ),
    (
        'Lesson Name 8', 8, 'not prepped', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.', '2024-02-13 14:02:59.13', '2024-02-13 14:02:59.13', 4
    );

CREATE SEQUENCE notes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."notes" (
    "id" integer DEFAULT nextval('notes_id_seq') NOT NULL,
    "note" text NOT NULL,
    "userId" integer NOT NULL,
    "lessonId" integer NOT NULL,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE thumbnails_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."thumbnails" (
    "id" integer DEFAULT nextval('thumbnails_id_seq') NOT NULL,
    "thumbnail" character varying(250) NOT NULL,
    "userId" integer NOT NULL,
    CONSTRAINT "thumbnails_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO
    "thumbnails" ("thumbnail", "userId")
VALUES ('course-image.png', 1);

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

INSERT INTO
    "units" (
        "unitNumber", "unitName", "courseId", "dateCreated", "dateUpdated"
    )
VALUES (
        1, 'Unit Name 1', 1, '2024-02-13 13:56:34.076', '2024-02-13 13:56:34.076'
    ),
    (
        2, 'Unit Name 2', 1, '2024-02-13 13:56:41.59', '2024-02-13 13:56:41.59'
    ),
    (
        3, 'Unit Name 3', 1, '2024-02-13 13:56:51.283', '2024-02-13 13:56:51.283'
    ),
    (
        4, 'Unit Name 4', 1, '2024-02-13 13:57:03.042', '2024-02-13 13:57:03.042'
    );

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

INSERT INTO
    "users" (
        "email", "password", "firstName", "lastName", "title", "organization", "dateCreated", "dateUpdated"
    )
VALUES (
        'iamseverous@hogwardsschoolofmagic.com', '$2b$10$1LqxuTPcdW5AMr8V7BsZ6OnPvEc1/lRcS3mdNJ05lMA9nJxIxD4kq', 'Severous', 'Snape', 'Defense Against the Dark Arts', 'Hogwards', '2024-01-25 21:11:44.275', '2024-01-25 21:11:44.275'
    );

ALTER TABLE ONLY "public"."courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."fileuploads" ADD CONSTRAINT "fileuploads_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES lessons(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."fileuploads" ADD CONSTRAINT "fileuploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."lessons" ADD CONSTRAINT "lessons_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES units(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."notes" ADD CONSTRAINT "notes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES lessons(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."thumbnails" ADD CONSTRAINT "thumbnails_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."units" ADD CONSTRAINT "units_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- CREATE SEQUENCE courses_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

-- CREATE TABLE "public"."courses" (
--     "id" integer DEFAULT nextval('courses_id_seq') NOT NULL,
--     "courseName" text NOT NULL,
--     "userId" integer NOT NULL,
--     "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     "isArchived" boolean DEFAULT false NOT NULL,
--     "thumbnail" character varying(250),
--     CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);

-- CREATE SEQUENCE lessons_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

-- CREATE TABLE "public"."lessons" (
--     "id" integer DEFAULT nextval('lessons_id_seq') NOT NULL,
--     "lessonName" text NOT NULL,
--     "lessonNumber" integer NOT NULL,
--     "completionStatus" text DEFAULT 'not prepped' NOT NULL,
--     "expectedOutcomes" text,
--     "assessment" text,
--     "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     "unitId" integer NOT NULL,
--     CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);

-- CREATE SEQUENCE thumbnails_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

-- CREATE TABLE "public"."thumbnails" (
--     "id" integer DEFAULT nextval('thumbnails_id_seq') NOT NULL,
--     "thumbnail" character varying(250) NOT NULL,
--     "userId" integer NOT NULL,
--     CONSTRAINT "thumbnails_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);

-- CREATE SEQUENCE units_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

-- CREATE TABLE "public"."units" (
--     "id" integer DEFAULT nextval('units_id_seq') NOT NULL,
--     "unitNumber" integer NOT NULL,
--     "unitName" text NOT NULL,
--     "courseId" integer NOT NULL,
--     "dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT "units_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);

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
--     "dateUpdated" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT "users_email_key" UNIQUE ("email"),
--     CONSTRAINT "users_pkey" PRIMARY KEY ("id")
-- ) WITH (oids = false);

-- ALTER TABLE ONLY "public"."courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- ALTER TABLE ONLY "public"."lessons" ADD CONSTRAINT "lessons_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES units(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- ALTER TABLE ONLY "public"."thumbnails" ADD CONSTRAINT "thumbnails_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- ALTER TABLE ONLY "public"."units" ADD CONSTRAINT "units_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- INSERT INTO "users" ("id", "email", "password", "firstName", "lastName", "title", "organization", "dateCreated", "dateUpdated") VALUES
-- (1,	'iamseverous@hogwardsschoolofmagic.com',	'$2b$10$1LqxuTPcdW5AMr8V7BsZ6OnPvEc1/lRcS3mdNJ05lMA9nJxIxD4kq',	'Severous',	'Snape',	'Defense Against the Dark Arts',	'Hogwards',	'2024-01-25 21:11:44.275',	'2024-01-25 21:11:44.275');

-- INSERT INTO "courses" ("id", "courseName", "userId", "dateCreated", "dateUpdated", "isArchived", "thumbnail") VALUES
-- (1,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (2,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (3,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (4,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (5,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (6,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (7,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (8,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (9,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (10,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (11,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (12,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (13,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (14,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (15,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (16,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (17,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (18,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (19,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (20,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (21,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (22,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (23,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (24,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (25,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (26,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (27,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (28,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (29,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (30,	'Defence Against the Dark Arts',	1,	'2024-02-10 17:50:28.182',	'2024-02-10 17:50:28.182',	'f',	NULL),
-- (31,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL),
-- (32,	'Potions',	1,	'2024-02-10 17:51:44.39',	'2024-02-10 17:51:44.39',	'f',	NULL);

-- INSERT INTO "units" ("id", "unitNumber", "unitName", "courseId", "dateCreated", "dateUpdated") VALUES
-- (1,	1,	'Unit Name 1',	1,	'2024-02-13 13:56:34.076',	'2024-02-13 13:56:34.076'),
-- (2,	2,	'Unit Name 2',	1,	'2024-02-13 13:56:41.59',	'2024-02-13 13:56:41.59'),
-- (3,	3,	'Unit Name 3',	1,	'2024-02-13 13:56:51.283',	'2024-02-13 13:56:51.283'),
-- (4,	4,	'Unit Name 4',	1,	'2024-02-13 13:57:03.042',	'2024-02-13 13:57:03.042');

-- INSERT INTO "lessons" ("id", "lessonName", "lessonNumber", "completionStatus", "expectedOutcomes", "assessment", "dateCreated", "dateUpdated", "unitId") VALUES
-- (1,	'Lesson Name 1',	1,	'not prepped',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 13:59:26.841',	'2024-02-13 13:59:26.841',	1),
-- (2,	'Lesson Name 2',	2,	'not prepped',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:00:41.818',	'2024-02-13 14:00:41.818',	1),
-- (3,	'Lesson Name 3',	3,	'prepped',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:01:05.337',	'2024-02-13 14:01:05.337',	2),
-- (4,	'Lesson Name 4',	4,	'done',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:01:22.764',	'2024-02-13 14:01:22.764',	2),
-- (5,	'Lesson Name 5',	5,	'done',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:01:47.124',	'2024-02-13 14:01:47.124',	3),
-- (6,	'Lesson Name 6',	6,	'not prepped',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:02:07.912',	'2024-02-13 14:02:07.912',	3),
-- (7,	'Lesson Name 7',	7,	'done',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:02:39.538',	'2024-02-13 14:02:39.538',	4),
-- (8,	'Lesson Name 8',	8,	'not prepped',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum veniam sint fugit, animi ipsum, natus ex quod pariatur aut, repellendus harum totam nulla nostrum commodi.',	'2024-02-13 14:02:59.13',	'2024-02-13 14:02:59.13',	4);

-- INSERT INTO "thumbnails" ("id", "thumbnail", "userId") VALUES
-- (1,	'course-image.png',	1);