import { shuffle } from 'lodash';
import React, { useEffect } from "react";
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



function Album() {
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
                <img className="h-44 w-44 shadow-2xl" src="https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/22/c8/9f/22c89f2d-9989-1996-c608-36e089a3767d/18UMGIM23645.rgb.jpg/1200x1200bb.jpg" alt="" />
                <div>
                    <p>ALBUM</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Esto Sí Es Cumbia</h1>
                    <p>Los Angeles Azules</p>
                </div>
            </section>

            <div>
                <Songs/>
            </div>
        </div>
    )
}
export default Album;