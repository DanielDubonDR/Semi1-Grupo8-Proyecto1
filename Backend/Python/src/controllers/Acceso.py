from flask import Blueprint, request, jsonify
from config.imageHandler import guardarImagen
from db import cerrarConexion, obtenerConexion
import bcrypt


BlueprintAcceso = Blueprint('acceso', __name__)

@BlueprintAcceso.route('/login', methods=['POST'])
def login():
    #variables de correo y contraseña que se reciben del front en un json
    data = request.get_json()
    correo = data['correo']
    password = data['password']
    #se hace la consulta a la base de datos
    cursor = obtenerConexion().cursor()
    query = cursor.execute("SELECT * FROM usuario WHERE correo = ?", (correo,))
    estado = False
    rol = 0

    if (query[0].length > 0):
        correoConsulta = query[0][0].correo

        if (correoConsulta == correo):
            passwordCifrado = query[0][0].password
            rol = query[0][0].rol
            status = compararPassword(password, passwordCifrado)
    return jsonify({'status': status, 'rol': rol})

@BlueprintAcceso.route('/registrar', methods=['POST'])
def registrar():
    #variables que se reciben del front en un json
    data = request.get_json()
    nombres = data['nombres']
    apellidos = data['apellidos']
    correo = data['correo']
    password = data['password']
    fecha_nac = data['fecha_nac']
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        contenido = imagen.read()
    status = False

    cursor = obtenerConexion().cursor()
    query = cursor.execute("SELECT * FROM usuario WHERE correo = ?", (correo,))
    if(not(query[0].length > 0)):
        passwordCifrado = cifrarPassword(password)
        #Guardar imagen
        nombre_imagen = guardarImagen(contenido, extension)
        id_foto = nombre_imagen['Key']
        path_foto = nombre_imagen['Location']
        cursor.execute("INSERT INTO usuario (correo, nombres, apellidos, password, fecha_nac, rol, id_foto, path_foto) VALUES (?,?,?,?,?,?,?,?)", (correo, nombres, apellidos, passwordCifrado, fecha_nac, 0, id_foto, path_foto))
        status = True
    
    return jsonify({'status': status})
    




async def cifrarPassword(password):
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