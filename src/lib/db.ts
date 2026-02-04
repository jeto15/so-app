import mysql from "mysql2/promise";

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
// });

const db = mysql.createPool({
    host: '167.88.44.199', // MySQL VPS IP address
    user: 'admin', // Your MySQL username
    password: 'Jetcom123!@#', // Your MySQL password
    database: 'stvno' // Your MySQL database name
});

export default db;
 
