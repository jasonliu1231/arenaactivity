var express = require("express");
var router = express.Router();
const DB = require("./conn.js");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "FJBC" });
});

router.get("/admin", function (req, res, next) {
    res.render("admin", { title: "FJBC" });
});

router.post("/arenaactivity", async function (req, res, next) {
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const sql = `INSERT INTO arenaactivity("teamName", "gameName", school, gread, tel, email, leader, createdon) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`;
        const params = [
            body.teamName,
            body.gameName,
            body.school,
            body.gread,
            body.tel,
            body.email,
            body.leader,
        ];
        await client.query(sql, params);
        res.send({
            isSuccess: true
        });
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/arenaactivity", async function (req, res, next) {
    const keyword = req.query.keyword;
    console.log(keyword)
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const params = [];
        let sql = `SELECT "teamName", "gameName", school, gread, tel, email, leader, createdon FROM arenaactivity`;
        if (keyword) {
          sql += ` WHERE "teamName" = $1`
          params.push(keyword);
        }
        sql += ` ORDER BY "teamName";`
        const result = await client.query(sql, params);
        res.send(result.rows);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/teamNames", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const sql = `SELECT "teamName" FROM arenaactivity GROUP BY "teamName"`;
        const result = await client.query(sql);
        res.send(result.rows);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
