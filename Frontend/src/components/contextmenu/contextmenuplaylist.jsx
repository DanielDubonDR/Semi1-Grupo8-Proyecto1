import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Service from '../../Service/Service';
const ContextMenuPlaylist = ({ xPos, yPos,id,fav, isOpen, onClose }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const handleEditPlaylist = () => {
    if(!fav){
        navigate(`/user/playlist/editar/${id}`)
    }else{
        Swal.fire({
            icon: 'error',
            title: 'No puedes editar la playlist de Mis Favoritos',
            text: 'Permiso Denegado!'
        })
    }
  }
  const handleEliminarPlaylist = () => {
    if(!fav){
        Swal.fire({
            title: 'Estas seguro de eliminar la Playlist?',
            text: "Esta accion no se va a revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borralo!'
          }).then((result) => {
            if (result.isConfirmed) {
                Service.eliminarPlaylist(id)
                .then(response => {
                    if(response.data.status){
                        Swal.fire(
                            'Se eliminó la Playlist!',
                            'Tu playlist ha sido eliminada correctamente!',
                            'success'
                        )
                        navigate('/user/home')
                    }else{
                        Swal.fire(
                            'Error!',
                            'Hubo un error al eliminar la playlist!',
                            'error'
                        )
                    }
                })
            }
          })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'No puedes eliminar la playlist de Mis Favoritos',
            text: 'Permiso Denegado!'
          })
    }
    }
  return (
    <div>
    <div className="z-10 absolute bg-black border border-black shadow-lg">
      <ul>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800" onClick={handleEliminarPlaylist}>Eliminar Playlist</li>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800" onClick={handleEditPlaylist}>Editar Playlist</li>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800" onClick={onClose}>Cerrar</li>
      </ul>
    </div>
    </div>
  );
}

export default ContextMenuPlaylist;
