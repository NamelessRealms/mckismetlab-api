import { createPool, Pool } from "mysql2/promise";
import Logs from "./logs";

export default class Mysql {

    public static mysqlPool: Pool | undefined;

    public static connect(): void {
        this.mysqlPool = createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            connectionLimit: 10
        });
        Logs.info(`Success connect Database: ${process.env.MYSQL_DATABASE}`);
    }

    public static getPool(): Pool {

        if (this.mysqlPool === undefined) {
            throw new Error("沒有 mysql 連接");
        }

        return this.mysqlPool as Pool;
    }
}
