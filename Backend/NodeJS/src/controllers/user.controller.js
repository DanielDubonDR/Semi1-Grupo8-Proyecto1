import { pool } from '../db.js'
import bcrypt from 'bcrypt'
import multer from 'multer';
import { saveObj, deleteObj } from '../config/objectHandler.js';
import { tipoObjeto } from '../config/constants.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


export const getUserById = async (req, res) => {
    const id = req.params.id;

    const query = await pool.query("SELECT correo, nombres, apellidos, fecha_nac, path_foto FROM usuario WHERE id_usuario = ?", [id]);
    const user = query[0][0];

    return res.send(user);
}

export const updateUserInfoById = async (req, res) => {

    const id = req.params.id;
    const { nombres, apellidos, fecha_nac, password } = req.body;
    let status = false;

    const query = await pool.query("SELECT password FROM usuario WHERE id_usuario = ?", [id]);
    const passwordCifrado = query[0][0].password;

    status = await compararPassword(password, passwordCifrado);

    if(status){
        const query = await pool.query("UPDATE usuario SET nombres = ?, apellidos = ?, fecha_nac = ? WHERE id_usuario = ?", [nombres, apellidos, fecha_nac, id]);
        status = query[0].affectedRows > 0;
    }

    return res.send({ "status": status });
}

export const updateUserImageById = async (req, res) => {
    const id = req.params.id;
    let status = false;

    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();

    const dataImg = await query("SELECT id_foto FROM usuario WHERE id_usuario = ?", [id]);
    const id_foto = dataImg[0][0].id_foto;

    if(id_foto != null){
        await deleteObj(id_foto);
    }

    const { Key: id_imagen, Location: path_imagen } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
    const query = await pool.query("UPDATE usuario SET path_foto = ?, id_foto = ? WHERE id_usuario = ?", [path_imagen, id_imagen, id]);
    status = query[0].affectedRows > 0;

    return res.send({ "status": status });
}

export const deleteUserById = async (req, res) => {
    const id = req.params.id;
    let status = false;

    const dataImg = await pool.query("SELECT id_foto FROM usuario WHERE id_usuario = ?", [id]);
    const id_foto = dataImg[0][0].id_foto;

    if(id_foto != null){
        await deleteObj(id_foto);
    }

    const query = await pool.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
    status = query[0].affectedRows > 0;

    return res.send({ "status": status });
}


const cifrarPassword = async (password) => {
    const salt = await bcrypt.genSalt(4);
    return await bcrypt.hash(password, salt);
}

const compararPassword = async (password, passwordCifrado) => {
    return await bcrypt.compare(password, passwordCifrado);
}