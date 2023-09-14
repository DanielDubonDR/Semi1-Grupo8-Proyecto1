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