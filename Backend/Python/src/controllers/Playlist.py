from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto
from db import  obtenerConexion
from io import BytesIO

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
    if portada.filename != '':
        data = portada.read()

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()

    #Guardar la imagen
    nombre_imagen = guardarObjeto(BytesIO(data), extension,"Imagenes/")
    id_foto = nombre_imagen['Key']
    path_foto = nombre_imagen['Location']
    cursor.execute("INSERT INTO playlist (nombre, descripcion, id_portada, path_portada) VALUES (%s, %s, %s, %s);", (nombre, descripcion,  id_foto, path_foto))
    
    playlistId = cursor.lastrowid
    conexion.commit()

    print(playlistId)

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
    #Pasar a un json
    for i in range(len(playlist)):
        playlist[i] = {
            'id_playlist': playlist[i][0],
            'nombre': playlist[i][1],
            'descripcion': playlist[i][2],
            'path_portada': playlist[i][3]
        }
    cursor.close()
    conexion.close()
    return jsonify(playlist)

@BlueprintPlaylist.route('/playlist/ver/<id_playlist>', methods=['GET'])
def verPlaylist(id_playlist):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s;", (id_playlist,))
    playlist = cursor.fetchall()
    #Pasar a un json
    for i in range(len(playlist)):
        playlist[i] = {
            'id_cancion': playlist[i][0],
            'nombre': playlist[i][1],
            'duracion': playlist[i][2],
            'id_imagen': playlist[i][3],
            'path_imagen': playlist[i][4],
            'path_cancion': playlist[i][5],
            'id_obj_cancion': playlist[i][6],
            'id_album': playlist[i][7]
        }
    cursor.close()
    conexion.close()
    return jsonify(playlist)

@BlueprintPlaylist.route('/playlist/modificar/info/<id_playlist>', methods=['PATCH'])
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
    if portada.filename != '':
        data = portada.read()

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT id_portada FROM playlist WHERE id_playlist = %s;", (id_playlist,))

    status = False
    result = cursor.fetchall()

    if len(result) > 0:
        id_portada = result[0][0]
        eliminarObjeto(id_portada)
        newObject = guardarObjeto(BytesIO(data), extension,"Imagenes/")
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

@BlueprintPlaylist.route('/playlist/eliminar/cancion/<id_playlist>/<id_cancion>', methods=['DELETE'])
def deleteSongFromPlaylist(id_playlist,id_cancion):
    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("DELETE FROM canciones_playlist WHERE id_cancion = %s AND id_playlist = %s;", (id_cancion, id_playlist))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})
