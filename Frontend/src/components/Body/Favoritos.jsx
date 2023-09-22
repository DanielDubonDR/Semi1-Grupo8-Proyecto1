import { shuffle } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import Service from '../../Service/Service';
import Header_name from "./Header_name";
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-purple",
    "from-lightPurple"
];


function Favoritos() {
    const [color, setColor] = useState(null);
    const [name_user, setName_user] = useState('');
    const [apellido_user, setApellido_user] = useState('');
    useEffect(() => {
        setColor(shuffle(colors).pop());
        const user_data = JSON.parse(sessionStorage.getItem('data_user'));
        Service.getDataUser(user_data.id)
        .then(response => {
            console.log(response)
            setApellido_user(response.data.apellidos)
            setName_user(response.data.nombres)
            console.log(image_user)
            console.log(name_user)
        })
    }, []);


    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-black">
            <Header_name/>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 relative`}>
                <img className="h-44 w-44 shadow-2xl" src="https://i.postimg.cc/RC7PRnrf/Black-Red-Minimal-Beat-Music-Logo-1000-1000-px.jpg" alt="" />
                <div>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Mis Favoritos</h1>
                    <p>{name_user + " " + apellido_user}</p>
                </div>
                <button className="bg-purple hover:bg-purple-700 text-white rounded-full p-3 absolute top-1/2 right-4 transform -translate-y-1/2 shadow-lg">
                    <BsPlayFill className="h-12 w-12" />
                </button>
            </section>

            <div>
                <Songs/>
            </div>
        </div>
    )
}
export default Favoritos;