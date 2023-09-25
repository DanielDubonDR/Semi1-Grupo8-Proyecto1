import React from "react";
import Song_Album from "./SongAlbum";


function SongsAlbum({canciones, artist, name_album}) {
    
    return (
        <div className=" px-8 flex flex-col space-y-1 pb-36 text-white">
            {canciones.map((cancion, i) => (
                <Song_Album key={cancion.id_cancion} order={i} track={cancion} artist={artist} name_album={name_album}/>
            ))}
        </div>
    )
}

export default SongsAlbum;