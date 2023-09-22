import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { album_artista } from "../datos_test/album_artista";
import { profiles } from "../datos_test/artistas";
import AlbumCard from "./AlbumCard";
import DetailsHeader from "./DetailsHeader";
import Header_name from "./Header_name";
import Songs from "./Songs";
const ArtistDetails = () => {
    const isPlaying = false;
    const { id } = useParams();
    const [artist, setArtist] = useState({});
    useEffect(() => {
        setArtist(profiles[id])
    })
    const activeSong = {};
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
            <Header_name/>
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