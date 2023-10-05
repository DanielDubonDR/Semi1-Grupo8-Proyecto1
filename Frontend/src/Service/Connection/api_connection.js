import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/'
});

//-----------------------USUARIOS-----------------------
// Registro de usuario
export const registro = async (formData) => {
    console.log([...formData.entries()]);
    const response = await instance.post('/registrar', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

// Login de usuario
export const login = async (data) => {
    const response = await instance.post('/login', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

// Actualizar datos de usuario
export const updateDataUser = async (data, id) => {
    const response = await instance.patch(`/usuario/modificar/info/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

//Actualizar la imagen del usuario
export const updateImageUser = async (data) => {
    const response = await instance.patch(`/usuario/modificar/imagen`, data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response;
}

// Obtener datos de usuario
export const getDataUser = async (id) => {
    const response = await instance.get(`/usuario/ver/${id}`);
    return response;
}

//Obtener el historial del usuario
export const getHistorial = async (id) => {
    const response = await instance.get(`/usuario/ver/historico/${id}`);
    return response;
}

//-----------------------PLAYLISTS-----------------------
//Crear playlist
export const crearPlaylist = async (data) => {
    const response = await instance.post('/playlist/crear', data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

//Obtener playlists del usuario
export const getPlaylists = async (id_usuario) => {
    const res = await instance.get(`/playlist/listar/${id_usuario}`);
    return res;
}

//Editar playlist
export const editarPortadaPlaylist = async (data, id) => {
    const response = await instance.patch(`/playlist/modificar/portada/${id}`, data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const editarDataPlaylist = async (data, id) => {
    const response = await instance.patch(`/playlist/modificar/info/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

//Eliminar playlist
export const eliminarPlaylist = async (id) => {
    const res = await instance.delete(`/playlist/eliminar/${id}`);
    return res;
}

//Obtener la info de la playlist por individual
export const getPlaylist = async (id) => {
    const res = await instance.get(`/playlist/ver/detalle/${id}`);
    return res;
}

//Obtener las canciones de la playlist
export const getCancionesPlaylist = async (id, id_user) => {
    const res = await instance.get(`/home/playlist/user/${id_user}/${id}`);
    return res;
}

//Agregar canciones a la playlist
export const agregarCancionPlaylist = async (data) => {
    const response = await instance.post('/playlist/agregar/cancion', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

//Eliminar canciones de la playlist
export const eliminarCancionPlaylist = async (id_playlist, id_cancion) => {
    const res = await instance.delete(`/playlist/eliminar/cancion/${id_playlist}/${id_cancion}`);
    return res;
}

//-----------------------HOME-----------------------
export const getHomeSongs = async (id_usuario) => {
    const res = await instance.get(`/home/canciones/user/${id_usuario}`);
    return res;
}

export const getAlbumsbyArtist = async (id_artista) => {
    const res = await instance.get(`/album/ver/${id_artista}`)
    return res
}

export const getCancionesbyArtist = async (id_artista, id_user) => {
    const res = await instance.get(`/home/artista/canciones/user/${id_user}/${id_artista}`)
    return res
}

export const getAlbum = async (id_album) => {
    const res = await instance.get(`/album/ver/album/${id_album}`)
    return res
}

//-----------------------FAVORITOS-----------------------
export const addFavorito = async (data) => {
    const response = await instance.post('/playlist/agregar/cancion/liked', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export const deleteFavorito = async (data) => {
    const res = await instance.delete('/playlist/eliminar/cancion/liked', {
        data,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    return res;
}

//-----------------------TOPS-----------------------
export const getTop5_Canciones= async (id_usuario) => {
    const res = await instance.get(`/usuario/ver/top5/songs/${id_usuario}`);
    return res;
}

export const getTop3_Artistas= async (id_usuario) => {
    const res = await instance.get(`/usuario/ver/top3/artistas/${id_usuario}`);
    return res;
}

export const getTop5_Albumes= async (id_usuario) => {
    const res = await instance.get(`/usuario/ver/top5/albumes/${id_usuario}`);
    return res;
}

export const postReproduccion = async (data) => {
    const res = await instance.post(`/usuario/add/history`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
}

// LISTANDO CANCIONES, ALBUMES Y ARTISTAS
export const listarCanciones = async () => {
    const res = await instance.get(`/cancion/listar`);
    return res;
}

export const listarAlbumes = async () => {
    const res = await instance.get(`/album/listar`);
    return res;
}

export const listarArtistas = async () => {
    const res = await instance.get(`/artista/listar`);
    return res;
}

// DELETE CANCIONES, ALBUMES Y ARTISTAS
export const eliminarCancion = async (data) => {
    console.log(data);
    const res = await instance.delete(`/cancion/eliminar`,{
        data,
        headers: {
            'Content-Type': 'application/json'
        }
        });

    return res;
}


// SUBIR FOTO
export const subirFotoCancion = async (formData) => {
    console.log([...formData.entries()]);
    const response = await instance.post('/cancion/subir/imagen', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

//SUBIR CANCION

export const subirCancion = async (formData) => {
    console.log([...formData.entries()]);
    const response = await instance.post('/cancion/subir/cancion', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

// CREAR CANCION
export const crearCancion = async (data) => {
    const response = await instance.post('/cancion/crear', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

// GET INFORMACION CANCION
export const getCancion = async (id) => {
    const response = await instance.get(`/cancion/ver/${id}`);
    return response;
}

//patch cancion
export const updateCancionImagen = async (data, id) => {
    const response = await instance.patch(`/cancion/modificar/image/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

export const updateCancionCancion = async (data, id) => {
    const response = await instance.patch(`/cancion/modificar/cancion/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

export const updateCancionInfo = async (data, id) => {
    const response = await instance.patch(`/cancion/modificar/info/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}
// CREAR ARTISTA:
export const crearArtista = async (data) => {
    const response = await instance.post('/artista/crear', data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

//Actualizar Imagen Artista
export const actualizarArtistaImagen = async (data, id) => {
    const response = await instance.patch(`/artista/modificar/image/${id}`, data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response;
}

//actualizar datos artista
export const actualizarArtista = async (data, id) => {
    const response = await instance.patch(`/artista/modificar/info/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

// eliminar artista
export const eliminarArtista = async (data) => {
    const res = await instance.delete(`/artista/eliminar`, {
        data,
        headers: {
            'Content-Type': 'application/json'
        }
        });

    return res;
}

//listar canciones en un album:
export const listarCancionesAlbum = async (id, id_user) => {
    console.log(id_user);
    console.log(id)
    const res = await instance.get(`/home/album/user/${id_user}/${id}`);
    console.log(res);
    return res;
}

//obtener artista por ID:
export const getArtista = async (id) => {
    const res = await instance.get(`/artista/ver/${id}`);
    return res;
}

//actualizar imagen album
export const actualizarAlbumImagen = async (data, id) => {
    const response = await instance.patch(`/album/modificar/imagen/${id}`, data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response;
}

//actualizar album
export const actualizarAlbum = async (data, id) => {
    const response = await instance.patch(`/album/modificar/info/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

export const crearAlbum = async (data) => {
    const response = await instance.post('/album/crear', data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const listarCancionesSinAlbum = async (id) => {
    const res = await instance.get(`/cancion/album/get/null/artist/${id}`);
    return res;
}

export const agregarCancionAlbum = async (data) => {
    const response = await instance.post('/album/add/song', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export const eliminarCancionAlbum = async (data) => {
    const res = await instance.delete('/album/eliminar/song', {
        data,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    return res;
}

export const eliminarAlbum = async (data) => {
    console.log(data);

    const res = await instance.delete('/album/eliminar', {
        data,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    return res;
}