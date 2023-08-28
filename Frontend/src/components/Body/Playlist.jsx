import { LogoutIcon } from "@heroicons/react/outline";
import { shuffle } from 'lodash';
import React, { useEffect } from "react";
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-yellow-500",
    "from-red-500",
    "from-pink-500",
    "from-purple",
    "from-lightPurple",
    "from-gray-500",
];



function Playlist() {
    const [color, setColor] = React.useState(null);

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, []);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
                    {/*En esta parte aparecera la foto del usuario, se uso esta como base para el diseño*/}
                    <img className="rounded-full w-10 h-10" 
                    src="https://img.freepik.com/vector-gratis/astronauta-dabbing-cartoon-vector-icon-illustration-concepto-icono-tecnologia-ciencia-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3360.jpg" 
                    alt="" 
                    />
                    <h2>username</h2>
                    <LogoutIcon className="h-5 w-5"/>
                </div>
            </header>
            <section 
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
            >
                <img className="h-44 w-44 shadow-2xl" src="https://i.pinimg.com/236x/bc/3e/3d/bc3e3de9ca839288c7779965afb5c17c.jpg" alt="" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Cumbiones para programar mientras lloras</h1>
                    <p>username</p>
                </div>
            </section>

            <div>
                <Songs/>
            </div>
        </div>
    )
}
export default Playlist;