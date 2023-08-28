import { pool } from "../db.js"

export const ping = async (req, res) => {
    res.send({ message: "pong" });
};

export const pong = async (req, res) => {
    console.log(req.body);
};

export const getInfoConnection = async (req, res) => {
    const info = await pool.query("SHOW DATABASES");
    res.send(info[0]);
};