import React from "react";
import { album_artista } from "../datos_test/album_artista";
import AlbumCard from "./AlbumCard";
import DetailsHeader from "./DetailsHeader";
import Songs from "./Songs";
const ArtistDetails = () => {
    const artist = {
        name : "Eminem",
        img : "https://phantom-marca.unidadeditorial.es/8ba8e88f28354c7d6fea00517edacedd/resize/828/f/jpg/assets/multimedia/imagenes/2022/10/19/16661328920205.jpg"
    }
    const isPlaying = false;
    const activeSong = {};
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
            <div className="flex flex-col">
                <DetailsHeader 
                artistData={artist}
                artistId={1}/>
            </div>
            <div className="ml-10">
                <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                    <h2 className="font-bold text-3xl text-white text-left">Álbumes</h2>
                </div>
                <div className="flex flex-wrap sm:justify-start justify-center gap-8 ml-5">
                    {album_artista.map((song, i) => (
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
                    <h2 className="font-bold text-3xl text-white text-left">Canciones</h2>
                </div>
                <div>
                    <Songs/>
                </div>
            </div>
        </div>
    )
}

export default ArtistDetails