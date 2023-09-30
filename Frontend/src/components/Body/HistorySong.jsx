import React from 'react';
import TiempoTranscurrido from './TiempoTranscurrido';
const HistorySong = ({ song, order }) => {
    console.log(song)
    return(
        <div className="grid grid-cols-3 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4 ">
                <p>{order +1}</p>
                <img 
                    className="h-10 w-10" 
                    src={song.path_imagen} 
                    alt="" 
                />

                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{song.nombre_cancion}</p>
                    <p>{song.nombre_artista}</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
            <p className="flex-grow w-12 hidden md:inline">{song.nombre_album}</p>
            </div>
            <div className="flex items-center justify-between">
                <p>{song.duracion_cancion}</p>
                <TiempoTranscurrido fecha={song.fecha}/>
            </div>
        </div>
    )
};
export default HistorySong;