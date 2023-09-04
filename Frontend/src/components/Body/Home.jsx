import React from "react";
import { albumes } from "../datos_test/albumes";
import { canciones } from "../datos_test/canciones";
import AlbumCard from "./AlbumCard";
import SongCard from "./SongCard";

function Home(){
    const isPlaying = false;
    const activeSong = {};
    return(
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black">
        <div className="flex flex-col ml-8 mb-20">
            <div className="w-full flex flex-wrap justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <img src="http://imgfz.com/i/pxcvWfe.png" alt="" className="w-20 order-2 sm:order-1" />
                <h1 className="font-bold text-4xl text-white text-left">Explora</h1>
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Canciones</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {canciones.map((song, i) => (
                    <SongCard 
                        key={i}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        i={i}
                    />
                ))}
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Álbumes</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {albumes.map((song, i) => (
                    <AlbumCard 
                        key={i}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        i={i}
                    />
                ))}
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Artistas</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {canciones.map((song, i) => (
                    <SongCard 
                        key={i}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        i={i}
                    />
                ))}
            </div>
        </div>
        </div>
    )
}

export default Home;