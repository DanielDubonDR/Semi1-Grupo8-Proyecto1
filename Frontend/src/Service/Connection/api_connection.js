import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/'
});

export const registro = async (formData) => {
    console.log([...formData.entries()]);
    const response = await instance.post('/registrar', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const login = async (data) => {
    const response = await instance.post('/login', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export const updateDataUser = async (data, id) => {
    const response = await instance.patch(`/usuario/modificar/info/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

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
    const res = await instance.delete(`/cancion/eliminar`, data,{
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
    const res = await instance.delete(`/artista/eliminar`, data,{
        headers: {
            'Content-Type': 'application/json'
        }
        });

    return res;
}