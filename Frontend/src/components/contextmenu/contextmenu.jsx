import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Service from '../../Service/Service';

const ContextMenu = ({ xPos, yPos, isOpen, onClose, id_cancion, id_playlist }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const handleEliminarCancion = () => {
    console.log(id_cancion);
    console.log(id_playlist);
    Service.eliminarCancionPlaylist(id_playlist, id_cancion)
      .then((response) => {
        if (response.data.status) {
          toast.success('Se eliminó la canción de esta playlist', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
          onClose();
          setTimeout(() => {
            navigate('/user/playlists');
          }, 2000);
        }else{
          toast.error('Ocurrió un error!, No se pudo eliminar la canción de la playlist', {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
          onClose();
        }
      })
      .catch((error) => {
        toast.error('Ocurrió un error!, No se pudo eliminar la canción de la playlist', {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        onClose();
      }
      );
  }
  return (
    <div className="z-10 absolute bg-black border border-black shadow-lg">
      <ul>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800" onClick={handleEliminarCancion}>Eliminar Cancion de la Playlist</li>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800" onClick={onClose}>Cerrar</li>
      </ul>
    </div>
  );
}

export default ContextMenu;
