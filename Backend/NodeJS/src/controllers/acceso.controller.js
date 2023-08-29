import { pool } from '../db.js'
import bcrypt from 'bcrypt'
import multer from 'multer';
import { saveImage } from '../config/imageHandler.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


export const registrar = async (req, res) => {
    const { nombres, apellidos, correo, password, fecha_nac } = req.body;
    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();
    let status = false

    const query = await pool.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

    if (!(query[0].length > 0)) {
        const passwordCifrado = await cifrarPassword(password);
        const { Key, Location } = await saveImage(buffer, fileExtension);
        const resultQuery = await pool.query("INSERT INTO usuario (correo, nombres, apellidos, password, fecha_nac, rol, id_foto, path_foto) VALUES (?,?,?,?,?,?,?,?)", [correo, nombres, apellidos, passwordCifrado, fecha_nac, 0, Key, Location]);
        status = true;
    }

    return res.send({ "status": status });
}

export const login = async (req, res) => {
    const { correo, password } = req.body;

    const query = await pool.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    let status = false;
    let rol = 0;

    if (query[0].length > 0){
        const correoConsulta = query[0][0].correo;

        if (correoConsulta === correo){
            const passwordCifrado = query[0][0].password;
            rol = query[0][0].rol;
            status = await compararPassword(password, passwordCifrado);
        }
    }

    return res.send({
        "status": status,
        "rol": rol
    });
}

const cifrarPassword = async (password) => {
    const salt = await bcrypt.genSalt(4);
    return await bcrypt.hash(password, salt);
}

const compararPassword = async (password, passwordCifrado) => {
    return await bcrypt.compare(password, passwordCifrado);
}