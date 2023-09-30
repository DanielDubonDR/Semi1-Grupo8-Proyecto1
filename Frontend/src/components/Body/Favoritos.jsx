import { shuffle } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import Service from '../../Service/Service';
import { usePlayer } from "../../context_Player/playerContext";
import Header_name from "./Header_name";
import Songs_Playlist from "./Songs_Playlist";

const colors = [
    "from-indigo-500",
    "from-purple",
    "from-lightPurple"
];


function Favoritos() {
    const [color, setColor] = useState(null);
    const [name_user, setName_user] = useState('');
    const [apellido_user, setApellido_user] = useState('');
    const [canciones, setCanciones] = useState([]);
    const [id, setId] = useState('');
    const [isModal, setIsModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [idSongModal, setIdSongModal] = useState('');
    const [idSongAlbumModal, setIdSongAlbumModal] = useState('');
    const [playlist_seleccionada, setPlaylist_seleccionada] = useState('');
    const [canciones_playlist, setCanciones_playlist] = useState([]);
    const [fullCanciones, setFullCanciones] = useState([]);
    const { cancionActual, setCancionActual, canc, setCanc, reproduciendose, setReproduciendose } = usePlayer();

    useEffect(() => {
        setColor(shuffle(colors).pop());
        const user_data = JSON.parse(localStorage.getItem('data_user'));
        Service.getDataUser(user_data.id)
        .then(response => {
            console.log(response)
            setApellido_user(response.data.apellidos)
            setName_user(response.data.nombres)
            console.log(image_user)
            console.log(name_user)
        })

        Service.getPlaylists(user_data.id)
        .then((response) => {
            setPlaylists(response.data);
            setId(response.data[0].id_playlist);
            Service.getCancionesPlaylist(response.data[0].id_playlist, user_data.id)
            .then(response => {
                setCanciones(response.data.songsWithLike);
            })
        })
    }, []);

    const playFavoritos = async (e) => {
        e.preventDefault();
        console.log(canciones);
        try {
          setCanc(canciones);
          setCancionActual(canciones[0]);
      
          let values = {
            id_cancion: canciones[0].id_cancion,
            id_album: canciones[0].id_album,
            id_usuario: usuario.id
          }
          let res2 = await Service.postReproduccion(values);
          console.log(res2.data);
          setReproduciendose(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

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
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-black">
            <Header_name/>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 relative`}>
                <img className="h-44 w-44 shadow-2xl" src="https://i.postimg.cc/RC7PRnrf/Black-Red-Minimal-Beat-Music-Logo-1000-1000-px.jpg" alt="" />
                <div>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Mis Favoritos</h1>
                    <p>{name_user + " " + apellido_user}</p>
                </div>
                <button className="bg-purple hover:bg-purple-700 text-white rounded-full p-3 absolute top-1/2 right-4 transform -translate-y-1/2 shadow-lg" onClick={(e) => playFavoritos(e)}>
                    <BsPlayFill className="h-12 w-12" />
                </button>
            </section>

            <div>
                <Songs_Playlist
                canciones={canciones}
                id_playlist={id}
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
export default Favoritos;