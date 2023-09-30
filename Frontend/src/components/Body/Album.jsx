import { shuffle } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Service from '../../Service/Service';
import Header_name from "./Header_name";
import SongsAlbum from './SongsAlbum';
const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-yellow-500",
    "from-red-500",
    "from-pink-500",
    "from-purple",
    "from-lightPurple",
    "from-gray-500",
];



function Album() {
    const [color, setColor] = React.useState(null);
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [nombre_artista, setNombre_artista] = useState('');
    const [path_imagen, setPath_imagen] = useState('');
    const [artista, setArtista] = useState('');
    const [canciones, setCanciones] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [idSongModal, setIdSongModal] = useState('');
    const [idSongAlbumModal, setIdSongAlbumModal] = useState('');
    const [playlist_seleccionada, setPlaylist_seleccionada] = useState('');
    const [canciones_playlist, setCanciones_playlist] = useState([]);
    useEffect(() => {
        setColor(shuffle(colors).pop());
        Service.getAlbum(id)
        .then(response => {
            console.log(response.data);
            setNombre(response.data.nombre);
            setPath_imagen(response.data.path_imagen);
            Service.getArtista(response.data.id_artista)
            .then(response => {
                setNombre_artista(response.data.nombres + ' ' + response.data.apellidos);
                setArtista(response.data);
            })
        })

        Service.listarCancionesAlbum(id, JSON.parse(localStorage.getItem('data_user')).id)
        .then(response => {
            setCanciones(response.data.songsWithLike);
        })
        const user_data = JSON.parse(localStorage.getItem('data_user'));
        Service.getPlaylists(user_data.id)
        .then((response) => {
            response.data.shift()
            setPlaylists(response.data);
        })

    }, []);
    console.log(canciones)
    const openModal = () => {
        setIsModal(true);
    }

    const closeModal = () => {
        setIsModal(false);
    }

    const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
    closeModal();
    }

    const handleCancelarModal = (e) => {
        e.preventDefault();
        closeModal();
    }

    const handleAbrirModal = (e) => {
        openModal()
    }
    
    const handleAddSongtoPlaylist = (e) => {
        e.preventDefault();
        if(playlist_seleccionada === ''){
            toast.error('Debe seleccionar una playlist', {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
              });
              return;
        }
        if(canciones_playlist.length > 0 && canciones_playlist.some(cancion => cancion.id_cancion === idSongModal)){
            toast.error('Esta canción ya fue agregada anteriormente a esa playlist', {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
              });
              return;
        }
        const enviar = {
            id_cancion: idSongModal,
            id_album: idSongAlbumModal,
            id_playlist: playlist_seleccionada
        }
        console.log(enviar);
        Service.agregarCancionPlaylist(enviar)
        .then(response => {
            console.log(response);
            if(response.data.status){
                closeModal();
                toast.success('Se agrego la canción a tu Playlist', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            }else{
                toast.error('Ocurrió un Error!,No se pudo agregar la cancion a la playlist', {
                    position: "bottom-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
            }
        })
        .catch(error => {
            toast.error('Ocurrió un Error!,No se pudo agregar la cancion a la playlist', {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
        })
    }

    const handleSelectChange = (e) => {
        console.log(e.target.value)
        setPlaylist_seleccionada(e.target.value);
        if(e.target.value !== ''){
            Service.getCancionesPlaylist(e.target.value)
            .then(response => {
                setCanciones_playlist(response.data);
            })
        }
    }
    console.log(nombre)
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <Header_name/>
            <section 
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 relative`}
            >
                <img className="h-44 w-44 shadow-2xl" src={path_imagen} alt="" />
                <div>
                    <p className='font-bold'>ALBUM</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{nombre}</h1>
                    <p>{nombre_artista}</p>
                </div>
                <button className="bg-purple hover:bg-purple-700 text-white rounded-full p-3 absolute top-1/2 right-4 transform -translate-y-1/2 shadow-lg">
                    <BsPlayFill className="h-12 w-12" />
                </button>
            </section>

            <div>
                <SongsAlbum
                canciones={canciones}
                artist={nombre_artista}
                name_album={nombre}
                opcion={handleAbrirModal}
                idSongModal={setIdSongModal}
                idSongAlbumModal={setIdSongAlbumModal}
                />
            </div>
            {isModal && (
             <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
             <div className="bg-black p-8 rounded shadow-lg">
               <h2 className="text-xl mb-4">Selecciona la playlist a agregar</h2>
               <form onSubmit={handleSubmit}>
                 <div className="mb-4">
                   <label className="block text-white text-sm font-bold mb-2" htmlFor="nombre">
                     PLAYLIST
                   </label>
                   <select
                    className="block appearance-none w-full bg-white border border-lightPurple text-black hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    id="example-select"
                    value={playlist_seleccionada}
                    onChange={handleSelectChange}
                >
                    <option selected={true} className="text-black" value="">Selecciona una playlist</option>
                    {playlists.map((playlist, i) => (
                        <option className="text-black" key={playlist.id_playlist} value={playlist.id_playlist}>{playlist.nombre}</option>
                    ))}
                </select>
                 </div>
                 <button
                   type="submit"
                   className="bg-lightPurple text-white hover:bg-white hover:text-lightPurple font-bold py-2 px-4 rounded"
                   onClick={handleAddSongtoPlaylist}
                 >
                   Agregar
                 </button>
                 <button
                   type="submit"
                   className="bg-lightPurple text-white hover:bg-white hover:text-lightPurple font-bold py-2 px-4 rounded ml-3"
                     onClick={handleCancelarModal}
                 >
                   Cancelar
                 </button>
               </form>
             </div>
           </div>
        )}
        <div>
        <ToastContainer />
        </div>
        </div>
    )
}
export default Album;