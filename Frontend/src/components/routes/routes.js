import axios from 'axios';

export const getTop5_Canciones= async () => {
    const res = await axios.get('http://localhost:4000/usuario/ver/top5/songs/1');
    return res;
}

export const getTop3_Artistas= async () => {
    const res = await axios.get('http://localhost:4000/usuario/ver/top3/artistas/1');
    return res;
}

export const getTop5_Albumes= async () => {
    const res = await axios.get('http://localhost:4000/usuario/ver/top5/albumes/1');
    return res;
}

export const postReproduccion = async (data) => {
    const res = await axios.post('http://localhost:4000/usuario/add/history/1', data);
    return res;
}
