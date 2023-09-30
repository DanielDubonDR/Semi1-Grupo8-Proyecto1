import React from "react";
import Song from "./Song";

function Songs({canciones, artist,opcion,idSongModal,idSongAlbumModal}) {
    
    return (
        <div className=" px-8 flex flex-col space-y-1 pb-36 text-white">
            {canciones.map((cancion, i) => (
                <Song key={cancion.id_cancion} order={i} track={cancion} artist={artist} opcion={opcion} idSongAlbumModal={idSongAlbumModal} idSongModal={idSongModal}/>
            ))}
        </div>
    )
}

export default Songs;