import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContextMenuPlaylist from "../contextmenu/contextmenuplaylist";


const PlaylistCard = ({playlist,name_user,fav, isPlaying, activeSong, i}) => {
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const handlePauseClick = () => {

    }

    const handlePlayClick = () => {
    }

    const navigate = useNavigate();
    const handleClick = () => {
        if(fav){
            navigate('/user/favoritos')
        }else{
            navigate(`/user/playlist/${playlist.id_playlist}`)
        }
    }

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenuOpen(true);
        setContextMenuPos({ x: e.clientX, y: e.clientY });
    }
    const handleCloseContextMenu = () => {
        setContextMenuOpen(false);
    }
    
    useEffect(() => {
        // Agregar un manejador de eventos para cerrar el menú al hacer clic en cualquier parte fuera de él
        const handleOutsideClick = (e) => {
            if (contextMenuOpen && !e.target.closest('.context-menu')) {
                setContextMenuOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        // Limpia el manejador de eventos cuando el componente se desmonta
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [contextMenuOpen]);

    return(
        <div className="flex flex-col w-[250px] p-4 bg-lightPurple bg-opacity-20 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"  onContextMenu={handleContextMenu}>
            <div className="relative w-full h-56 group" onClick={handleClick}>
                <img src={fav?'https://i.postimg.cc/RC7PRnrf/Black-Red-Minimal-Beat-Music-Logo-1000-1000-px.jpg':playlist?.path_portada} alt="song_img" />
            </div>
            <div className="mt-4 flex flex-col">
                <p className="font-semibold text-lg text-white truncate">
                    {fav?'Mis Favoritos':playlist?.nombre}
                </p>
                <p className="text-sm truncate text-gray-400 mt-1">
                    {fav?'Favoritos de '+ name_user:"Playlist de " + name_user}
                </p>
            </div>
            <ContextMenuPlaylist
                isOpen={contextMenuOpen}
                xPos={contextMenuPos.x}
                yPos={contextMenuPos.y}
                id={playlist.id_playlist}
                fav={fav}                
                onClose={handleCloseContextMenu}
            />
        </div>
    );
}

export default PlaylistCard;