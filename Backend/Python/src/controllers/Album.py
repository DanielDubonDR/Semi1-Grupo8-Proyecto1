from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto
from db import  obtenerConexion

BlueprintAlbum = Blueprint('album', __name__)

