import { pool } from '../db.js'
import bcrypt from 'bcrypt'
import multer from 'multer';
import { saveObj, deleteObj } from '../config/objectHandler.js';
import { tipoObjeto } from '../config/constants.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


export const getUserById = async (req, res) => {

    try {
        const id = req.params.id;
    
        const query = await pool.query("SELECT correo, nombres, apellidos, fecha_nac, path_foto FROM usuario WHERE id_usuario = ?", [id]);
        const user = query[0][0];
    
        return res.send(user);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
}

export const updateUserInfoById = async (req, res) => {

    try{

        const id = req.params.id;
        const { nombres, apellidos, correo, password } = req.body;
        let status = false;
    
        const query = await pool.query("SELECT password, correo FROM usuario WHERE id_usuario = ?", [id]);
        const passwordCifrado = query[0][0].password;
        const correoActual = query[0][0].correo;
    
        status = await compararPassword(password, passwordCifrado);
    
        if(status){
    
            if(correoActual != correo){
                const query2 = await pool.query("SELECT COUNT(*) AS 'count' FROM usuario WHERE correo = ?", [correo]);
                status = query2[0][0].count == 0;
            }
    
            if(status){
                const query3 = await pool.query("UPDATE usuario SET nombres = ?, apellidos = ?, correo = ? WHERE id_usuario = ?", [nombres, apellidos, correo, id]);
                status = query3[0].affectedRows > 0;
            }
        }
    
        return res.send({ "status": status });
    }catch(error){
        console.log(error);
        return res.send({ "status": false });
    }
}

export const updateUserImageById = async (req, res) => {
    try{
        const {idUser:id, password} = req.body;
        let status = false;
    
        const query = await pool.query("SELECT password, correo FROM usuario WHERE id_usuario = ?", [id]);
        const passwordCifrado = query[0][0].password;
    
        status = await compararPassword(password, passwordCifrado);
    
        if(status){
            const { buffer, originalname } = req.file;
            const fileExtension = originalname.split('.').pop();
        
            const dataImg = await pool.query("SELECT id_foto FROM usuario WHERE id_usuario = ?", [id]);
            const id_foto = dataImg[0][0].id_foto;
        
            if(id_foto != null){
                await deleteObj(id_foto);
            }
        
            const { Key: id_imagen, Location: path_imagen } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
            const query = await pool.query("UPDATE usuario SET path_foto = ?, id_foto = ? WHERE id_usuario = ?", [path_imagen, id_imagen, id]);
            status = query[0].affectedRows > 0;
        }
    
        return res.send({ "status": status });

    } catch (error) {
        console.log(error);
        return res.send({ "status": false });
    }
}

export const deleteUserById = async (req, res) => {

    try{

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

    }catch(error){
        console.log(error);
        return res.send({ "status": false });
    }

}


const cifrarPassword = async (password) => {
    const salt = await bcrypt.genSalt(4);
    return await bcrypt.hash(password, salt);
}

const compararPassword = async (password, passwordCifrado) => {
    return await bcrypt.compare(password, passwordCifrado);
}

export const setHistory = async (req, res) => {

    try{
        const { id_cancion, id_album, id_usuario } = req.body;
        let status = false;

        const currentDatetime = new Date();
        const formattedDatetime = currentDatetime.toISOString().slice(0, 19).replace('T', ' ');

        
        const query = await pool.query("INSERT INTO historico (id_cancion, id_album, id_usuario, fecha) VALUES (?, ?, ?, ?)", [id_cancion, id_album, id_usuario, formattedDatetime]);
        status = query[0].affectedRows > 0;

        return res.send({ "status": status });
    } catch (error) {
        return res.send({ "status": false });
    }
}

export const getTop5songs = async (req, res) => {

    try{
        const id_usuario = req.params.id;
        
        const query = await pool.query("SELECT id_cancion, COUNT(id_cancion) AS 'reproducciones' FROM historico WHERE id_usuario = ? GROUP BY id_cancion ORDER BY reproducciones DESC LIMIT 5", [id_usuario]);
    
        if (query[0].length == 0) {
            return res.send([]);
        }
    
        const query2 = await pool.query("SELECT id_cancion, nombre, duracion, path_cancion, path_imagen FROM cancion WHERE id_cancion IN (?)", [query[0].map((item) => item.id_cancion)]);
    
        // unir los dos arrays
        for(let i = 0; i < query[0].length; i++){
            query[0][i] = {...query[0][i], ...query2[0][i]};
        }
    
        return res.send(query[0]);

    }catch(error){
        console.log(error);
        return res.send({ "status": false });
    }

}

export const top3Artistas = async (req, res) => {

    try {
        // SELECT a.id_artista, CONCAT(a.nombres, ' ', a.apellidos) AS nombre_artista, COUNT(*) AS reproducciones FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN artista a ON al.id_artista = a.id_artista JOIN usuario u ON h.id_usuario = u.id_usuario WHERE u.id_usuario = 2 GROUP BY a.id_artista, nombre_artista ORDER BY reproducciones DESC LIMIT 3;
        const id_usuario = req.params.id;
        const query = await pool.query("SELECT a.id_artista, CONCAT(a.nombres, ' ', a.apellidos) AS nombre_artista, a.path_fotografia , COUNT(*) AS reproducciones FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN artista a ON al.id_artista = a.id_artista JOIN usuario u ON h.id_usuario = u.id_usuario WHERE u.id_usuario = ? GROUP BY a.id_artista, nombre_artista ORDER BY reproducciones DESC LIMIT 3", [id_usuario]);
    
        return res.send(query[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const top5Albumes = async (req, res) => {

    try {
        const id_usuario = req.params.id;
        const query = await pool.query("SELECT id_album, COUNT(id_album) AS reproducciones FROM historico WHERE id_usuario = ? GROUP BY id_album ORDER BY reproducciones DESC LIMIT 5", [id_usuario]);
    
        if (query[0].length == 0) {
            return res.send([]);
        }
    
        const query2 = await pool.query("SELECT id_album, nombre, path_imagen FROM album WHERE id_album IN (?)", [query[0].map((item) => item.id_album)]);
    
        // unir los dos arrays
        for(let i = 0; i < query[0].length; i++){
            query[0][i] = {...query[0][i], ...query2[0][i]};
        }

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
    

        return res.send(query[0]);
}

export const getHistory = async (req, res) => {

    try {
        // SELECT h.fecha, c.nombre AS nombre_cancion, c.duracion AS duracion_cancion, a.nombres AS nombre_artista, al.nombre AS nombre_album FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN artista a ON al.id_artista = a.id_artista WHERE h.id_usuario = 2 ORDER BY h.fecha DESC;
        const id_usuario = req.params.id;
        const query = await pool.query("SELECT h.fecha, c.nombre AS nombre_cancion, c.duracion AS duracion_cancion, a.nombres AS nombre_artista, al.nombre AS nombre_album FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN artista a ON al.id_artista = a.id_artista WHERE h.id_usuario = ? ORDER BY h.fecha DESC", [id_usuario]);
    
        return res.send(query[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }


}