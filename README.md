# Course Grid Project

Welcome to the Course Grid Project, a full-stack application developed with the following technologies:

## Technologies Used:

- **Frontend:** Next.js, Tailwind CSS, Font Awesome icons
- **Text Editor API:** TinyMCE
- **Authentication:** JSON Web Tokens (JWT)
- **Backend:** Prisma database ORM, PostgreSQL database system, Docker Compose
- **Testing Suite:** Jest for CRUD transactions, validation, and token authentication methods
- **Data Validation:** Zod
- **File Storage:** Multer

## Overview:

The Course Grid Project is a comprehensive journaling web app designed specifically for faculty teachers. It enables teachers to perform CRUD operations on courses, lessons, and units. Within lessons, they can manage course notes and upload file attachments. This functionality empowers teachers to track their practices, evaluate student reception and outcomes, and continuously improve their teaching methods.

Please note that this solution is intended for individual instructor use and is not designed as an enterprise centralized solution.

## Build Instructions:

1. Install dependencies: `npm install`
2. Run Docker Compose: `docker compose up -d`
3. Push database changes: `npx prisma db push`
4. Update `.env` file:
   - Copy the key entry from `TEST_DATABASE_URL`
   - Replace the database URL in `.prisma/schema.prisma` with this key name:
     ```plaintext
     // in prisma/schema.prisma
     datasource db {
       provider = "postgresql"
       url      = env("TEST_DATABASE_URL")
     }
     ```
5. Push database changes again: `npx prisma db push`
   1. Revert the database URL change in `.prisma/schema.prisma` back to `DATABASE_URL`

      ```

      ```
6. Run tests: `npm run test`
7. Run local development build: `npm run dev`

For cloud deployment, use `npm run build` and `npm run start`. Ensure that your cloud infrastructure provider supports these commands. Note that this project requires Node.js version 20 for development and deployment.
