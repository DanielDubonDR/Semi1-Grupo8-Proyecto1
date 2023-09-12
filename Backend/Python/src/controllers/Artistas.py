from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto
from db import  obtenerConexion

BlueprintArtistas = Blueprint('artistas', __name__)

@BlueprintArtistas.route('/artista/crear', methods=['POST'])
def crearArtista():
    #variables que se reciben del front en un formulario
    nombres = request.form['nombres']
    apellidos = request.form['apellidos']
    fecha_nac = request.form['fecha_nac']
    imagen = request.files['imagen']

    #Extension de la imagen
    extension = imagen.filename.split('.')[-1]
    contenido = imagen.read()

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    #Guardar la imagen
    nombre_imagen = guardarObjeto(contenido, extension,"Imagenes/")
    id_foto = nombre_imagen['Key']
    path_foto = nombre_imagen['Location']
    cursor.execute("INSERT INTO artista (nombres, apellidos, fecha_nac, path_fotografia, id_fotografia) VALUES (%s, %s, %s, %s, %s);", (nombres, apellidos, fecha_nac, path_foto, id_foto))
    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintArtistas.route('/artista/listar', methods=['GET'])
def listarArtistas():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM artista;")
    data = cursor.fetchall()
    cursor.close()
    conexion.close()
    return jsonify(data)

@BlueprintArtistas.route('/artista/ver/<id>', methods=['GET'])
def verArtista(id):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM artista WHERE id_artista = %s;", (id,))
    data = cursor.fetchone()
    cursor.close()
    conexion.close()
    return jsonify(data)

#Falta probar hasta que se creen canciones
@BlueprintArtistas.route('/artista/ver/canciones/<id>', methods=['GET'])
def verCancionesArtista(id):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    query='''
    SELECT
        cancion.nombre AS songName,
        cancion.path_imagen,
        cancion.id_cancion,
        album.nombre AS albumName,
        album.id_album
    FROM 
        cancion
    INNER JOIN 
        cancion_album 
    ON 
        cancion.id_cancion = cancion_album.id_cancion
    INNER JOIN
        album
    ON
        cancion_album.id_album = album.id_album
    WHERE
        album.id_artista = %s;
    '''
    cursor.execute(query, (id,))
    data = cursor.fetchall()
    cursor.close()
    conexion.close()
    return jsonify(data)

@BlueprintArtistas.route('/artista/modificar/info/<id>', methods=['PATCH'])
def modificarInfoArtista(id):
    #JSON que se recibe del front
    data = request.get_json()
    nombres = data['nombres']
    apellidos = data['apellidos']
    fecha_nac = data['fecha_nac']

    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("UPDATE artista SET nombres = %s, apellidos = %s, fecha_nac = %s WHERE id_artista = %s;", (nombres, apellidos, fecha_nac, id))

    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})


@BlueprintArtistas.route('/artista/modificar/image/<id>', methods=['PATCH'])
def modificarImagenArtista(id):

    #variables que se reciben del front en un formulario
    imagen = request.files['imagen']

    #Extension de la imagen
    extension = imagen.filename.split('.')[-1]
    contenido = imagen.read()

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    #Eliminar la imagen anterior y guardar la nueva
    cursor.execute("SELECT id_fotografia FROM artista WHERE id_artista = %s;", (id,))

    result = cursor.fetchall()

    if len(result) > 0:
        id_foto = result[0][0]
        eliminarObjeto(id_foto)
        nombre_imagen = guardarObjeto(contenido, extension,"Imagenes/")
        id_foto = nombre_imagen['Key']
        path_foto = nombre_imagen['Location']
        cursor.execute("UPDATE artista SET path_fotografia = %s, id_fotografia = %s WHERE id_artista = %s;", (path_foto, id_foto, id))
        status = cursor.rowcount > 0
        conexion.commit()
    
    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintArtistas.route('/artista/eliminar/<id>', methods=['DELETE'])
def eliminarArtista(id):
    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id_fotografia FROM artista WHERE id_artista = %s;", (id,))

    result = cursor.fetchall()

    if len(result) > 0:
        if result[0][0]:
            id_foto = result[0][0]
            eliminarObjeto(id_foto)
    cursor.execute("DELETE FROM artista WHERE id_artista = %s;", (id,))
    status = cursor.rowcount > 0
    conexion.commit()
    
    cursor.close()
    conexion.close()

    return jsonify({'status': status})
    
