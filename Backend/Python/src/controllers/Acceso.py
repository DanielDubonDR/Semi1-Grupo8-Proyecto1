from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto
from db import  obtenerConexion
import bcrypt


BlueprintAcceso = Blueprint('acceso', __name__)

@BlueprintAcceso.route('/login', methods=['POST'])
def login():
    #variables de correo y contraseña que se reciben del front en un json
    data = request.get_json()
    correo = data['correo']
    password = data['password']
    #se hace la consulta a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT correo,password,rol FROM usuario WHERE correo = %s;", (correo,))
    query = cursor.fetchall()
    estado = False
    rol = 0
    if (len(query) > 0):
        correoConsulta = query[0][0]

        if (correoConsulta == correo):
            passwordCifrado = query[0][1]
            rol = query[0][2]
            status = compararPassword(password, passwordCifrado)
    return jsonify({'status': status, 'rol': rol})

@BlueprintAcceso.route('/registrar', methods=['POST'])
def registrar():
    #variables que se reciben del front en un formulario
    nombres = request.form['nombres']
    apellidos = request.form['apellidos']
    correo = request.form['correo']
    password = request.form['password']
    fecha_nac = request.form['fecha_nac']
    imagen = request.files['imagen']

    #Extension de la imagen
    extension = imagen.filename.split('.')[-1]
    contenido = imagen.read()


    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM usuario WHERE correo = %s;", (correo,))
    query = cursor.fetchall()
    if query is None or len(query) == 0:
        passwordCifrado = cifrarPassword(password)
         #Guardar la imagen
        nombre_imagen = guardarObjeto(contenido, extension,"Imagenes/")
        id_foto = nombre_imagen['Key']
        path_foto = nombre_imagen['Location']
        cursor.execute("INSERT INTO usuario (correo, nombres, apellidos, password, fecha_nac, rol, id_foto, path_foto) VALUES (%s,%s,%s,%s,%s,%s,%s,%s);", (correo, nombres, apellidos, passwordCifrado, fecha_nac, 0, id_foto, path_foto))
        conexion.commit()

        #Crer playlist de favoritos
        usuarioId = cursor.lastrowid

        cursor.execute("INSERT INTO playlist (nombre, descripcion) VALUES (%s,%s);", ("Me gusta", "La musica que te gusta en un solo lugar"))
        conexion.commit()

        playlistId = cursor.lastrowid

        cursor.execute("INSERT INTO playlist_usuario (id_playlist, id_usuario) VALUES (%s,%s);", (playlistId, usuarioId))
        conexion.commit()
        
        cursor.close()
        conexion.close()
        status = True
    return jsonify({'status': status})
 
def cifrarPassword(password):
    #saltos
    salt = bcrypt.gensalt(4)

    #se cifra la contraseña
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    #se retorna la contraseña cifrada
    return hashed_password.decode('utf-8')

def compararPassword(password, passwordCifrado):
    #se compara la contraseña que se recibe del front con la que esta en la base de datos
    password = password.encode('utf-8')
    passwordCifrado = passwordCifrado.encode('utf-8')
    if bcrypt.checkpw(password, passwordCifrado):
        return True
    else:
        return False