from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto
from db import  obtenerConexion
from io import BytesIO

BlueprintCancion = Blueprint('cancion', __name__)

@BlueprintCancion.route('/cancion/subir/imagen', methods=['POST'])
def subirImagen():
    imagen = request.files['imagen']
    #Extension de la imagen
    extension = imagen.filename.split('.')[-1]
    if imagen.filename != '':
        data = imagen.read()
    #Guardar la imagen
    nombre_imagen = guardarObjeto(BytesIO(data), extension,"Imagenes/")
    #Pasar a un json
    nombre_imagen = {
        'id_imagen': nombre_imagen['Key'],
        'path_imagen': nombre_imagen['Location']
    }
    return jsonify(nombre_imagen)

@BlueprintCancion.route('/cancion/subir/cancion', methods=['POST'])
def subirCancion():
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

@BlueprintCancion.route('/cancion/crear', methods=['POST'])
def crearCancion():
    #variables que se reciben del front en un json
    data = request.get_json()
    nombre = data['nombre']
    duracion = data['duracion']
    id_imagen = data['id_imagen']
    path_imagen = data['path_imagen']
    id_cancion = data['id_cancion']
    path_cancion = data['path_cancion']

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("INSERT INTO cancion (nombre, duracion, id_imagen, path_imagen, id_obj_cancion, path_cancion) VALUES (%s, %s, %s, %s, %s, %s);", (nombre, duracion, id_imagen, path_imagen, id_cancion, path_cancion))

    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintCancion.route('/cancion/listar', methods=['GET'])
def listarCancion():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM cancion;") # id_cancion, nombre, duracion, id_imagen, path_imagen, path_cancion, id_obj_cancion
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
            'id_obj_cancion': cancion[i][6]
        }
    cursor.close()
    conexion.close()
    return jsonify(cancion)

@BlueprintCancion.route('/cancion/album/listar', methods=['GET'])
def listarCancionAlbum():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
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
            'id_album': cancion[i][7]
        }
    cursor.close()
    conexion.close()
    return jsonify(cancion)

@BlueprintCancion.route('/cancion/ver/<id_cancion>', methods=['GET'])
def verCancionId(id_cancion):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM cancion WHERE id_cancion = %s;", (id_cancion,))
    cancion = cursor.fetchone()
    #Pasar a un json
    cancion = {
        'id_cancion': cancion[0],
        'nombre': cancion[1],
        'duracion': cancion[2],
        'id_imagen': cancion[3],
        'path_imagen': cancion[4],
        'path_cancion': cancion[5],
        'id_obj_cancion': cancion[6]
    }
    cursor.close()
    conexion.close()
    return jsonify(cancion)

@BlueprintCancion.route('/cancion/album/ver/<id_album>', methods=['GET'])
def verCancionAlbum(id_album):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
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
            'id_album': cancion[i][7]
        }
    cursor.close()
    conexion.close()
    return jsonify(cancion)

@BlueprintCancion.route('/cancion/modificar/info/<id_cancion>', methods=['PATCH'])
def modificarCancion(id_cancion):
    data = request.get_json()
    nombre = data['nombre']
    duracion = data['duracion']
    

    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("UPDATE cancion SET nombre = %s, duracion = %s WHERE id_cancion = %s;", (nombre, duracion, id_cancion))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintCancion.route('/cancion/modificar/image/<id_cancion>', methods=['PATCH'])
def modificarImagenCancion(id_cancion):
    data = request.get_json()
    id_imagen = data['id_imagen']
    path_imagen = data['path_imagen']

    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("UPDATE cancion SET id_imagen = %s, path_imagen = %s WHERE id_cancion = %s;", (id_imagen, path_imagen, id_cancion))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintCancion.route('/cancion/modificar/cancion/<id_cancion>', methods=['PATCH'])
def modificarCancionCancion(id_cancion):
    data = request.get_json()
    id_obj_cancion = data['id_cancion']
    path_cancion = data['path_cancion']

    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("UPDATE cancion SET id_obj_cancion = %s, path_cancion = %s WHERE id_cancion = %s;", (id_obj_cancion, path_cancion, id_cancion))

    status = cursor.rowcount > 0

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintCancion.route('/cancion/eliminar/<id_cancion>', methods=['DELETE'])
def eliminarCancion(id_cancion):
    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT id_imagen, id_obj_cancion FROM cancion WHERE id_cancion = %s;", (id_cancion,))

    result = cursor.fetchall()


    if len(result) > 0:
        if result[0][0]:
            id_foto = result[0][0]
            eliminarObjeto(id_foto)
        if result[0][1]:
            id_cancion_obj = result[0][1]
            eliminarObjeto(id_cancion_obj)
        cursor.execute("DELETE FROM cancion WHERE id_cancion = %s;", (id_cancion,))
    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})