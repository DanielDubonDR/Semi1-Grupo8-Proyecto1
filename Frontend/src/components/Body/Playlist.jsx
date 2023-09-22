import { shuffle } from 'lodash';
import React, { useEffect } from "react";
import { BsPlayFill } from "react-icons/bs";
import Header_name from "./Header_name";
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
            <Header_name/>
            <section 
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
            >
                <img className="h-44 w-44 shadow-2xl" src="https://i.pinimg.com/236x/bc/3e/3d/bc3e3de9ca839288c7779965afb5c17c.jpg" alt="" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Cumbiones para programar mientras lloras</h1>
                    <p>username</p>
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
export default Playlist;