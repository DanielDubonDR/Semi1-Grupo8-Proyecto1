import React from "react";
import Song_Playlist from "./Song_Playlist";

function Songs_Playlist({canciones, id_playlist,opcion,idSongModal,idSongAlbumModal}) {
    
    return (
        <div className=" px-8 flex flex-col space-y-1 pb-36 text-white">
            {canciones.map((cancion, i) => (
                <Song_Playlist key={i} order={i} track={cancion} id_playlist={id_playlist} opcion={opcion} idSongAlbumModal={idSongAlbumModal} idSongModal={idSongModal}/>
            ))}
        </div>
    )
}

export default Songs_Playlist;