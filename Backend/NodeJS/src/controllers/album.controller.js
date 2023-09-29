import { pool } from "../db.js";
import multer from 'multer';
import { saveObj, deleteObj } from '../config/objectHandler.js';
import { tipoObjeto } from '../config/constants.js';
import { comparePassword } from "../config/objectHandler.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const createAlbum = async (req, res) => {

    try {
        const { nombre, descripcion, id_artista } = req.body;
        let status = false;
        const { buffer, originalname } = req.file;
        const fileExtension = originalname.split('.').pop();
    
        const { Key: id_imagen, Location: path_imagen } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
    
        const query = await pool.query("INSERT INTO album (nombre, descripcion, id_artista, id_imagen, path_imagen) VALUES (?,?,?,?,?)", [nombre, descripcion, id_artista, id_imagen, path_imagen]);
        
        status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getAlbums = async (req, res) => {

    try {
        const query = await pool.query("SELECT * FROM album");
    
        res.status(200).send(query[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getAlbumsByArtist = async (req, res) => {

    try {
        const query = await pool.query("SELECT * FROM album WHERE id_artista = ?", [req.params.id]);
    
        res.status(200).send(query[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getAlbumById = async (req, res) => {

    try {
        const query = await pool.query("SELECT * FROM album WHERE id_album = ?", [req.params.id]);
    
        res.status(200).send(query[0][0]);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getAlbumSongsById = async (req, res) => {

    try {
        const query = await pool.query("SELECT cancion.*, id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion_album.id_album = ?", [req.params.id]);
    
        res.status(200).send(query[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const updateAlbumInfoById = async (req, res) => {

    try {
        const id = req.params.id;
        const { nombre, descripcion, id_artista} = req.body;
        let status = false;
    
        const query = await pool.query("UPDATE album SET nombre = ?, descripcion = ?, id_artista = ? WHERE id_album = ?", [nombre, descripcion, id_artista, id]);
        status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
    
}

export const updateAlbumImagenById = async (req, res) => {

    try {
        const id = req.params.id;
        const { buffer, originalname } = req.file;
        const fileExtension = originalname.split('.').pop();
        let status = false;
    
        const query = await pool.query("SELECT id_imagen FROM album WHERE id_album = ?", [id]);
    
        if(query[0].length > 0){
            await deleteObj(query[0][0].id_imagen);
            const { Key: id_imagen, Location: path_imagen } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
            const query2 = await pool.query("UPDATE album SET id_imagen = ?, path_imagen = ? WHERE id_album = ?", [id_imagen, path_imagen, id]);
            status = query2[0].affectedRows > 0;
        }
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
    
}

export const addSongToAlbum = async (req, res) => {

    try {
        const { id_album, id_cancion } = req.body;
        let status = false;
    
        const query = await pool.query("INSERT INTO cancion_album (id_album, id_cancion) VALUES (?,?)", [id_album, id_cancion]);
        status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const deleteAlbumById = async (req, res) => {

    try {
        const { idUser, idAlbum, password } = req.body;
    
        const query = await pool.query("SELECT password, rol FROM usuario WHERE id_usuario = ?", [idUser]);
    
        if(query[0].length > 0)
        {
    
            if(query[0][0].rol !== 1)
            {
                return res.status(200).json( { status: false } );
            }
    
            const { password: passwordCifrado } = query[0][0];
            const isPasswordCorrect = await comparePassword(password, passwordCifrado);
    
            if(isPasswordCorrect)
            {
                const query2 = await pool.query("SELECT id_imagen FROM album WHERE id_album = ?", [idAlbum]);
    
                if(query2[0].length > 0){
                    if(query2[0][0].id_imagen != null){
                        await deleteObj(query2[0][0].id_imagen);
                    }
                    const query3 = await pool.query("DELETE FROM album WHERE id_album = ?", [idAlbum]);
                    
                    const status = query3[0].affectedRows > 0;
    
                    res.status(200).json( { status } );
                }
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
    
}

export const deleteSongAlbum = async (req, res) => {

    console.log(req.body)
    try {
        const { id_album, id_cancion } = req.body;
        let status = false;
        console.log(req.body);
        const query = await pool.query("DELETE FROM cancion_album WHERE id_album = ? AND id_cancion = ?", [id_album, id_cancion]);
        status = query[0].affectedRows > 0;

        res.status(200).json( { status } );
    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
}