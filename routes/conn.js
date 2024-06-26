const { Pool } = require("pg");

//連接PG資料庫
class Conndb {
    async connectpgdb() {
        let pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_SERVER,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT)
        });
        try {
            const client = await pool.connect();
            return client;
        } catch (err) {
            pool.end();
            console.error(err);
        }
    }
}

module.exports = Conndb;
