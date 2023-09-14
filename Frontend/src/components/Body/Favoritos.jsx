import { shuffle } from 'lodash';
import React, { useEffect } from "react";
import Header_name from "./Header_name";
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-purple",
    "from-lightPurple"
];


function Favoritos() {
    const [color, setColor] = React.useState(null);

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, []);

    const name_user = JSON.parse(sessionStorage.getItem('data_user')).nombres;
    const apellido_user = JSON.parse(sessionStorage.getItem('data_user')).apellidos;

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-black">
            <Header_name/>
            <section 
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
            >
                <img className="h-44 w-44 shadow-2xl" src="https://i.postimg.cc/RC7PRnrf/Black-Red-Minimal-Beat-Music-Logo-1000-1000-px.jpg" alt="" />
                <div>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Mis Favoritos</h1>
                    <p>{name_user + " " + apellido_user}</p>
                </div>
            </section>

            <div>
                <Songs/>
            </div>
        </div>
    )
}
export default Favoritos;