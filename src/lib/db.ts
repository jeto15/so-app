import mysql from "mysql2/promise";

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
// });

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "admin",
  password: "Jetcom123!@#",
  database: "stvno",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log('hello jet', db);

export default db;
 
