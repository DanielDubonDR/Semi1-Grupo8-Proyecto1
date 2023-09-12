from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto
from db import  obtenerConexion

BlueprintPlaylist = Blueprint('playlist', __name__)

@BlueprintPlaylist.route('/playlist/crear', methods=['POST'])
def crearPlaylist():
    #variables que se reciben del front en un formulario
    nombre = request.form['nombre']
    descripcion = request.form['descripcion']
    portada = request.files['portada']
    id_usuario = request.form['id_usuario']

    #Extension de la imagen
    extension = portada.filename.split('.')[-1]
    contenido = portada.read()

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()

    #Guardar la imagen
    nombre_imagen = guardarObjeto(contenido, extension,"Imagenes/")
    id_foto = nombre_imagen['Key']
    path_foto = nombre_imagen['Location']
    cursor.execute("INSERT INTO playlist (nombre, descripcion, id_portada, path_portada) VALUES (%s, %s, %s, %s, %s);", (nombre, descripcion,  id_foto, path_foto))
    conexion.commit()

    playlistId = cursor.lastrowid

    cursor.execute("INSERT INTO playlist_usuario (id_usuario, id_playlist) VALUES (%s, %s);", (id_usuario, playlistId))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintPlaylist.route('/playlist/agregar/cancion', methods=['POST'])
def agregarCancion():
    #variables que se reciben del front en un json
    data = request.get_json()
    id_playlist = data['id_playlist']
    id_cancion = data['id_cancion']
    id_album = data['id_album']

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("INSERT INTO canciones_playlist (id_playlist, id_cancion, id_album) VALUES (%s, %s, %s);", (id_playlist, id_cancion, id_album))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintPlaylist.route('/playlist/listar/<id_usuario>', methods=['GET'])
def listarPlaylist(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id_playlist, nombre, descripcion, path_portada FROM playlist WHERE id_playlist IN (SELECT id_playlist FROM playlist_usuario WHERE id_usuario = %s);", (id_usuario,))
    playlist = cursor.fetchall()
    cursor.close()
    conexion.close()
    return jsonify(playlist)

@BlueprintPlaylist.route('/playlist/ver/<id_playlist>', methods=['GET'])
def verPlaylist(id_playlist):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s;", (id_playlist,))
    playlist = cursor.fetchone()
    cursor.close()
    conexion.close()
    return jsonify(playlist)

@BlueprintPlaylist.route('/playlist/modificar/foto/<id_playlist>', methods=['PATCH'])
def modificarFotoPlaylist(id_playlist):
    data = request.get_json()
    nombre = data['nombre']
    descripcion = data['descripcion']

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("UPDATE playlist SET nombre = %s, descripcion = %s WHERE id_playlist = %s;", (nombre, descripcion, id_playlist))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintPlaylist.route('/playlist/modificar/portada/<id_playlist>', methods=['PATCH'])
def modificarPortadaPlaylist(id_playlist):
    #variables que se reciben del front en un formulario
    portada = request.files['portada']

    #Extension de la imagen
    extension = portada.filename.split('.')[-1]
    contenido = portada.read()

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT id_portada FROM playlist WHERE id_playlist = %s;", (id_playlist,))

    result = cursor.fetchall()

    if len(result) > 0:
        id_portada = result[0][0]
        eliminarObjeto(id_portada)
        newObject = guardarObjeto(contenido, extension,"Imagenes/")
        id_foto = newObject['Key']
        path_foto = newObject['Location']
        cursor.execute("UPDATE playlist SET id_portada = %s, path_portada = %s WHERE id_playlist = %s;", (id_foto, path_foto, id_playlist))
        status = cursor.rowcount > 0
        conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintPlaylist.route('/playlist/eliminar/<id_playlist>', methods=['DELETE'])
def eliminarPlaylist(id_playlist):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id_portada FROM playlist WHERE id_playlist = %s;", (id_playlist,))

    result = cursor.fetchall()

    if len(result) > 0:
        if result[0][0] is not None:
            id_portada = result[0][0]
            eliminarObjeto(id_portada)
    cursor.execute("DELETE FROM playlist WHERE id_playlist = %s;", (id_playlist,))
    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})