import { pool } from "../db.js";
import multer from 'multer';
import { saveObj, deleteObj } from '../config/objectHandler.js';
import { tipoObjeto } from '../config/constants.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const createPlaylist = async (req, res) => {

    const { nombre, descripcion, id_usuario } = req.body;
    let status = false;
    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();

    const { Key: id_portada, Location: path_portada } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);

    const query = await pool.query("INSERT INTO playlist (nombre, descripcion, id_portada, path_portada) VALUES (?,?,?,?)", [nombre, descripcion, id_portada, path_portada]);
    const id_playlist = query[0].insertId;
    const query2 = await pool.query("INSERT INTO playlist_usuario (id_usuario, id_playlist) VALUES (?,?)", [id_usuario, id_playlist]);

    status = query[0].affectedRows > 0;

    res.status(200).json( { status } );
}

export const getPlaylistsByIdUser = async (req, res) => {

    const id_usuario = req.params.id;

    const query = await pool.query("SELECT id_playlist, nombre, descripcion, path_portada FROM playlist WHERE id_playlist IN (SELECT id_playlist FROM playlist_usuario WHERE id_usuario = ?)", [id_usuario]);

    res.status(200).send(query[0]);
}

export const getPlaylistSongsById = async (req, res) => {

    const id_playlist = req.params.id;

    const query = await pool.query("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = ?", [id_playlist]);

    res.status(200).send(query[0]);
}

export const addSongToPlaylist = async (req, res) => {

    const { id_cancion, id_playlist, id_album } = req.body;

    const query = await pool.query("INSERT INTO canciones_playlist (id_cancion, id_playlist, id_album) VALUES (?,?,?)", [id_cancion, id_playlist, id_album]);

    const status = query[0].affectedRows > 0;

    res.status(200).json( { status } );
}

export const updatePlaylistInfoById = async (req, res) => {
    
    const { nombre, descripcion } = req.body;

    const query = await pool.query("UPDATE playlist SET nombre = ?, descripcion = ? WHERE id_playlist = ?", [nombre, descripcion, req.params.id]);

    const status = query[0].affectedRows > 0;

    res.status(200).json( { status } );
}

export const updatePlaylistPortadaById = async (req, res) => {
    
    const id = req.params.id;
    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();
    let status = false;

    const query = await pool.query("SELECT id_portada FROM playlist WHERE id_playlist = ?", [id]);

    if(query[0].length > 0){
        await deleteObj(query[0][0].id_portada);
        const { Key: id_portada, Location: path_portada } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
        const query2 = await pool.query("UPDATE playlist SET id_portada = ?, path_portada = ? WHERE id_playlist = ?", [id_portada, path_portada, id]);
        status = query2[0].affectedRows > 0;
    }

    res.status(200).json( { status } );
}

export const deletePlaylistById = async (req, res) => {
    
    const id = req.params.id;
    let status = false;

    const qeury = await pool.query("SELECT id_portada FROM playlist WHERE id_playlist = ?", [id]);

    if(qeury[0].length > 0){
        if (qeury[0][0].id_portada != null){
            await deleteObj(qeury[0][0].id_portada);
        }
        const query2 = await pool.query("DELETE FROM playlist WHERE id_playlist = ?", [id]);
        status = query2[0].affectedRows > 0;
    }

    res.status(200).json( { status } );
}

export const deleteSongFromPlaylist = async (req, res) => {
        
        const { idc:id_cancion, idp:id_playlist } = req.params;

        console.log(id_cancion, id_playlist);
    
        const query = await pool.query("DELETE FROM canciones_playlist WHERE id_cancion = ? AND id_playlist = ?", [id_cancion, id_playlist]);
    
        const status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );
}

export const setLikedPlaylist = async (req, res) => {

    const { id_usuario, id_cancion, id_album } = req.body;

    try{
        const getIDLikedPlaylist = await pool.query("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario=?", [id_usuario]);

        const id_playlist = getIDLikedPlaylist[0][0].id_playlist;

        const query = await pool.query("INSERT INTO canciones_playlist (id_cancion, id_playlist, id_album) VALUES (?,?,?)", [id_cancion, id_playlist, id_album]);

        const status = query[0].affectedRows > 0;

        res.status(200).json( { status } );
    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
}

export const deleteLikedPlaylist = async (req, res) => {

    const { id_usuario, id_cancion } = req.body;

    try{
        const getIDLikedPlaylist = await pool.query("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario=?", [id_usuario]);

        const id_playlist = getIDLikedPlaylist[0][0].id_playlist;

        const query = await pool.query("DELETE FROM canciones_playlist WHERE id_cancion = ? AND id_playlist = ?", [id_cancion, id_playlist]);

        const status = query[0].affectedRows > 0;

        res.status(200).json( { status } );
    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
}