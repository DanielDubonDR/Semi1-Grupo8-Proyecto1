from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto, compararPassword
from db import  obtenerConexion
from io import BytesIO

BlueprintCancion = Blueprint('cancion', __name__)

@BlueprintCancion.route('/cancion/subir/imagen', methods=['POST'])
def subirImagen():
    try:
        imagen = request.files['imagen']
        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        if imagen.filename != '':
            data = imagen.read()
        #Guardar la imagen
        nombre_imagen = guardarObjeto(BytesIO(data), extension,"Fotos/")
        #Pasar a un json
        nombre_imagen = {
            'id_imagen': nombre_imagen['Key'],
            'path_imagen': nombre_imagen['Location']
        }
        return jsonify(nombre_imagen)
    except Exception as e:
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/subir/cancion', methods=['POST'])
def subirCancion():
    try:
        cancion = request.files['cancion']
        #Extension de la imagen
        extension = cancion.filename.split('.')[-1]
        if cancion.filename != '':
            data = cancion.read()
        #Guardar la imagen
        nombre_cancion = guardarObjeto(BytesIO(data), extension,"Canciones/")
        #Pasar a un json
        nombre_cancion = {
            'id_cancion': nombre_cancion['Key'],
            'path_cancion': nombre_cancion['Location']
        }

        return jsonify(nombre_cancion)
    except Exception as e:
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/crear', methods=['POST'])
def crearCancion():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un json
        data = request.get_json()
        nombre = data['nombre']
        duracion = data['duracion']
        id_imagen = data['id_imagen']
        path_imagen = data['path_imagen']
        id_cancion = data['id_cancion']
        path_cancion = data['path_cancion']
        id_artista = data['id_artista']
        print(path_cancion)
        status = False

        

        cursor.execute("INSERT INTO cancion (nombre, duracion, id_imagen, path_imagen, id_obj_cancion, path_cancion, id_artista) VALUES (%s, %s, %s, %s, %s, %s, %s);", (nombre, duracion, id_imagen, path_imagen, id_cancion, path_cancion, id_artista))

        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/listar', methods=['GET'])
def listarCancion():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT c.*, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM cancion c, artista a WHERE c.id_artista=a.id_artista;") # id_cancion, nombre, duracion, id_imagen, path_imagen, path_cancion, id_obj_cancion
        cancion = cursor.fetchall()
        #Pasar a un json
        for i in range(len(cancion)):
            cancion[i] = {
                'id_cancion': cancion[i][0],
                'nombre': cancion[i][1],
                'duracion': cancion[i][2],
                'id_imagen': cancion[i][3],
                'path_imagen': cancion[i][4],
                'path_cancion': cancion[i][5],
                'id_obj_cancion': cancion[i][6],
                'id_artista': cancion[i][7]
            }
        cursor.close()
        conexion.close()
        return jsonify(cancion)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintCancion.route('/cancion/album/listar', methods=['GET'])
def listarCancionAlbum():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT cancion.*, cancion_album.id_album FROM cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion;")
        cancion = cursor.fetchall()
        #Pasar a un json
        for i in range(len(cancion)):
            cancion[i] = {
                'id_cancion': cancion[i][0],
                'nombre': cancion[i][1],
                'duracion': cancion[i][2],
                'id_imagen': cancion[i][3],
                'path_imagen': cancion[i][4],
                'path_cancion': cancion[i][5],
                'id_obj_cancion': cancion[i][6],
                'id_artista': cancion[i][7],
                'id_album': cancion[i][8]
            }
        cursor.close()
        conexion.close()
        return jsonify(cancion)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintCancion.route('/cancion/ver/<id_cancion>', methods=['GET'])
def verCancionId(id_cancion):
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT c.*, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM cancion c, artista a WHERE c.id_artista=a.id_artista AND c.id_cancion = %s;", (id_cancion,))
        cancion = cursor.fetchone()
        #Pasar a un json
        cancion = {
            'id_cancion': cancion[0],
            'nombre': cancion[1],
            'duracion': cancion[2],
            'id_imagen': cancion[3],
            'path_imagen': cancion[4],
            'path_cancion': cancion[5],
            'id_obj_cancion': cancion[6],
            'id_artista': cancion[7],
            'nombre_artista': cancion[8]
        }
        cursor.close()
        conexion.close()
        return jsonify(cancion)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintCancion.route('/cancion/album/ver/<id_album>', methods=['GET'])
def verCancionAlbum(id_album):
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT cancion.*, cancion_album.id_album FROM cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion.id_cancion = %s;", (id_album,))
        cancion = cursor.fetchall()
        #Pasar a un json
        for i in range(len(cancion)):
            cancion[i] = {
                'id_cancion': cancion[i][0],
                'nombre': cancion[i][1],
                'duracion': cancion[i][2],
                'id_imagen': cancion[i][3],
                'path_imagen': cancion[i][4],
                'path_cancion': cancion[i][5],
                'id_obj_cancion': cancion[i][6],
                'id_artista': cancion[i][7],
                'id_album': cancion[i][8]
            }
        cursor.close()
        conexion.close()
        return jsonify(cancion)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintCancion.route('/cancion/modificar/info/<id_cancion>', methods=['PATCH'])
def modificarCancion(id_cancion):
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        nombre = data['nombre']
        duracion = data['duracion']
        id_artista = data['id_artista']

        

        status = False


        cursor.execute("UPDATE cancion SET nombre = %s, duracion = %s, id_artista = %s WHERE id_cancion = %s;", (nombre, duracion, id_artista, id_cancion))

        status = cursor.rowcount > 0

        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/modificar/image/<id_cancion>', methods=['PATCH'])
def modificarImagenCancion(id_cancion):
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        id_imagen = data['id_imagen']
        path_imagen = data['path_imagen']

        status = False

        cursor.execute("UPDATE cancion SET id_imagen = %s, path_imagen = %s WHERE id_cancion = %s;", (id_imagen, path_imagen, id_cancion))

        status = cursor.rowcount > 0

        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/modificar/cancion/<id_cancion>', methods=['PATCH'])
def modificarCancionCancion(id_cancion):
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        id_obj_cancion = data['id_cancion']
        path_cancion = data['path_cancion']

        status = False

        cursor.execute("UPDATE cancion SET id_obj_cancion = %s, path_cancion = %s WHERE id_cancion = %s;", (id_obj_cancion, path_cancion, id_cancion))

        status = cursor.rowcount > 0

        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/eliminar/', methods=['DELETE'], strict_slashes=False)
def eliminarCancion():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        status = False

        data = request.get_json()
        idUser = data['idUser']
        password = data['password']
        idSong = data['idSong']

        cursor.execute("SELECT * FROM usuario WHERE id_usuario = %s;", (idUser,))
        result = cursor.fetchone()

        if len(result) > 0:
            if result[6] != 1:
                status = False
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            contraseniaCifrada = result[4]
            status = compararPassword(password, contraseniaCifrada)
            if status == False:
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            cursor.execute("SELECT * FROM cancion WHERE id_cancion = %s;", (idSong,))
            result = cursor.fetchone()
            if len(result) > 0:
                id_imagen = result[3]
                eliminarObjeto(id_imagen)
                id_obj_cancion = result[6]
                eliminarObjeto(id_obj_cancion)
                cursor.execute("DELETE FROM cancion WHERE id_cancion = %s;", (idSong,))
                status = cursor.rowcount > 0
                conexion.commit()
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            else:
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
        else:
            cursor.close()
            conexion.close()
            return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintCancion.route('/cancion/album/get/null/artist/<id_artista>', methods=['GET'])
def getSongAlbumNullByArtist(id_artista):
    
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT * FROM cancion WHERE id_artista = %s AND id_cancion NOT IN (SELECT id_cancion FROM cancion_album);", (id_artista,))
        cancion = cursor.fetchall()
        #Pasar a un json
        for i in range(len(cancion)):
            cancion[i] = {
                'id_cancion': cancion[i][0],
                'nombre': cancion[i][1],
                'duracion': cancion[i][2],
                'id_imagen': cancion[i][3],
                'path_imagen': cancion[i][4],
                'path_cancion': cancion[i][5],
                'id_obj_cancion': cancion[i][6],
                'id_artista': cancion[i][7]
            }
        cursor.close()
        conexion.close()
        return jsonify(cancion)
    except Exception as e:
        print(e)
        cursor.close()
        conexion.close()
        return jsonify({'status': False})