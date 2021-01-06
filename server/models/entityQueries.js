import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.on("error", (error) => {
  console.log(error);
});

const createTables = pool.query(`
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    job_role VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    address VARCHAR(150) NOT NULL
);
INSERT INTO users(
    first_name, last_name, email, password, gender, job_role, department, address
)
VALUES(
    "Jeremiah",
    "ASUQUO",
    "jbassuquo4@gmail.com",
    "$2b$10$nhZCvSMTdKg/MI7gVTWwj.WCeq7tTSpr4xj4xzVmIbdCoHnwj9nwy",
    "Male",
    "Web Developer",
    "IT",
    "Cross River, Nigeria"
);

DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts(
    id SERIAL NOT NULL PRIMARY KEY,
    author_id SERIAL NOT NULL,
    title VARCHAR(50) NOT NULL,
    post VARCHAR NOT NULL,
    created_on VARCHAR NOT NULL,
    updated_on VARCHAR NOT NULL,
);

INSERT INTO posts(
    author_id, title, post, created_on, updated_on
)
VALUES(
    2,
    "lorem ipsum lorem ipsum lorem ipsum",
    "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    "25/12/20 21:04:59",
    "25/12/20 21:04:59"
);

DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments(
    id SERIAL NOT NULL PRIMARY KEY,
    author_id SERIAL NOT NULL,
    post_id SERIAL NOT NULL,
    comment VARCHAR NOT NULL,
    created_on VARCHAR NOT NULL,
    updated_on VARCHAR NOT NULL
);

INSERT INTO comments(
    author_id, post_id, comment, created_on, updated_on
)
VALUES(
    2,
    1,
    "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    "25/12/20 21:04:59",
    "25/12/20 21:04:59"
);
`);

export default createTables;
