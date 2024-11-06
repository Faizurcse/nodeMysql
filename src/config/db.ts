import mysql from "mysql2/promise"

const mysqlPool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:'A180184',
    database:'admin'
})
export default mysqlPool;

