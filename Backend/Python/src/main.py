from flask import Flask, request, jsonify
import json
from flask_cors import CORS
from db import blueprint as dbprueba
from controllers.Acceso import BlueprintAcceso
from controllers.Artistas import BlueprintArtistas
from controllers.Album import BlueprintAlbum
from controllers.Cancion import BlueprintCancion
from controllers.User import BlueprintUser
from controllers.Playlist import BlueprintPlaylist
from controllers.Home import BlueprintHome


app = Flask(__name__)
CORS(app)



app.register_blueprint(dbprueba)
app.register_blueprint(BlueprintAcceso)
app.register_blueprint(BlueprintArtistas)
app.register_blueprint(BlueprintAlbum)
app.register_blueprint(BlueprintCancion)
app.register_blueprint(BlueprintUser)
app.register_blueprint(BlueprintPlaylist)
app.register_blueprint(BlueprintHome)


@app.route('/', methods=['GET'])
def index():
    return 'Hello World'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)