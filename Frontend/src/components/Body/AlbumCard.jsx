import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/Service";


const AlbumCard = ({album, isPlaying, activeSong, i}) => {

    const [nameArtista, setNameArtista] = useState('');

    useEffect(() => {
        Service.getArtista(album.id_artista)
        .then(response => {
            setNameArtista(response.data.nombres + ' ' + response.data.apellidos);
        })
    }, [])
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/user/album/${album.id_album}`)
    }

    return(
        <div className="flex flex-col w-[250px] p-4 bg-white bg-opacity-20 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer" onClick={handleClick}>
            <div className="relative w-full h-56 group">
                {/*<div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.name? 'flex bg-black bg-opacity-70': 'hidden'}`}>
                    <PlayPause
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        song={song}
                        handlePause={handlePauseClick}
                        handlePlay={handlePlayClick}
                    />
    </div>*/}
                <img src={album.path_imagen} alt="song_img" />
            </div>
            <div className="mt-4 flex flex-col">
                <p className="font-semibold text-lg text-white truncate">
                    {album.nombre}
                </p>
                <p className="text-sm truncate text-gray-400 mt-1">
                    {nameArtista}
                </p>
            </div>
        </div>
    );
}

export default AlbumCard;