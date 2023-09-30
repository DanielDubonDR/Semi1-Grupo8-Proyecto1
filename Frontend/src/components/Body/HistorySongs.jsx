import React from "react";
import HistorySong from "./HistorySong";
const HistorySongs = ({canciones, artist, name_album,opcion,idSongModal,idSongAlbumModal}) => {
    return (
        <div className=" px-8 flex flex-col space-y-1 pb-36 text-white">
            {canciones.map((cancion, i) => (
                <HistorySong key={i} order={i} song={cancion}/>
            ))}
        </div>
    )
}

export default HistorySongs;