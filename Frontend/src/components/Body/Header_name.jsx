import { LogoutIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/Service";
import { useUserContext } from "../../context/UserContext";



function Header_name() {
    const {logueado, setLogueado} = useUserContext();
    const navigate = useNavigate();
    const handlelogout = () => {
        localStorage.removeItem('data_user');
        setLogueado(false);
        navigate('/login');
    }
    const [image_user, setImage_user] = useState('');
    const [name_user, setName_user] = useState('');

    useEffect(() => {
        const user_data = JSON.parse(localStorage.getItem('data_user'));
        console.log(user_data.id)
        Service.getDataUser(user_data.id)
        .then(response => {
            console.log(response)
            setImage_user(response.data.path_foto)
            setName_user(response.data.nombres)
            console.log(image_user)
            console.log(name_user)
        })
    }, [logueado])
    console.log(image_user)
    console.log(name_user)
    return (
        <div>
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
                    {/*En esta parte aparecera la foto del usuario, se uso esta como base para el diseño*/}
                    <img className="rounded-full w-10 h-10" 
                    src={image_user} 
                    alt="" 
                    />
                    <h2>{name_user}</h2>
                    <LogoutIcon className="h-5 w-5" onClick={handlelogout}/>
                </div>
            </header>
        </div>
    )
}

export default Header_name;