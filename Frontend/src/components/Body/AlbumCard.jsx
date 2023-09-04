import React from "react";
import PlayPause from "./PlayPause";


const AlbumCard = ({song, isPlaying, activeSong, i}) => {

    const handlePauseClick = () => {

    }

    const handlePlayClick = () => {
    }


    return(
        <div className="flex flex-col w-[250px] p-4 bg-white bg-opacity-20 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
            <div className="relative w-full h-56 group">
                <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.name? 'flex bg-black bg-opacity-70': 'hidden'}`}>
                    <PlayPause
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        song={song}
                        handlePause={handlePauseClick}
                        handlePlay={handlePlayClick}
                    />
                </div>
                <img src={song?.img} alt="song_img" />
            </div>
            <div className="mt-4 flex flex-col">
                <p className="font-semibold text-lg text-white truncate">
                    {song?.name}
                </p>
                <p className="text-sm truncate text-gray-400 mt-1">
                    {song?.artist}
                </p>
            </div>
        </div>
    );
}

export default AlbumCard;