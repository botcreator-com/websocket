import mysql from "mysql2";

/** 
 * A simple function to Open the database
 * 
**/
export default async function Database(){
    let database = process.env.DB_DB,
        user = process.env.DB_USER,
        host= process.env.DB_HOST,
        password = process.env.DB_PASSWORD,
        port = process.env.DB_PORT;
    if(!database) return false;
    if(!user) return false;
    if(!host) return false;
    if(!password) return false;
    if(!port) return false;
    const createConnextion = mysql.createPool({
        host: host,
        port: Number(port),
        user:  user,
        password:  password,
        database: database, 
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0});
    return createConnextion.promise(undefined);
};
/**
 * 
 * @param host 
 * @param user 
 * @param password 
 * @param database 
 * @returns {Promise<Pool>}
 */
export async function makeDatabase(host: string,user:string, password: string, database: string){
    const createConnextion = mysql.createPool({
        host: host,
        port: 3306,
        user:  user,
        password:  password,
        database: database, 
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0});
    return createConnextion.promise();
}