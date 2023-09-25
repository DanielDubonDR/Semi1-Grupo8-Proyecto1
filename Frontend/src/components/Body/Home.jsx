import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Service from "../../Service/Service";
import { useUserContext } from '../../context/UserContext';
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import Header_name from "./Header_name";
import SongCard from "./SongCard";

function Home(){
    const isPlaying = false;
    const {logueado, setLogueado} = useUserContext();
    const [text_welcome, setText_welcome] = useState('');
    const [songs, setSongs] = useState([]);
    const [albumes, setAlbumes] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [idSongModal, setIdSongModal] = useState('');
    const [idSongAlbumModal, setIdSongAlbumModal] = useState('');
    const [playlist_seleccionada, setPlaylist_seleccionada] = useState('');
    const [canciones_playlist, setCanciones_playlist] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if(!logueado){
            navigate('/login');
        }
        const user_data = JSON.parse(sessionStorage.getItem('data_user'));
        Service.getDataUser(user_data.id)
        .then(response => {
            const hora = new Date().getHours();

            if (hora >= 5 && hora < 12) {
                setText_welcome(`Buenos días ${response.data.nombres}!`);
            } else if (hora >= 12 && hora < 18) {
                setText_welcome(`Buenas tardes ${response.data.nombres}!`);
            } else {
                setText_welcome(`Buenas noches ${response.data.nombres}!`);
            }
        })

        Service.getHomeSongs(user_data.id)
        .then(response => {
            setSongs(response.data.songsWithLike);
        })

        Service.listarAlbumes()
        .then(response => {
            setAlbumes(response.data);
        })

        Service.listarArtistas()
        .then(response => {
            setArtistas(response.data);
        })

        Service.getPlaylists(user_data.id)
        .then((response) => {
            response.data.shift()
            setPlaylists(response.data);
        })
    }, [logueado])
    
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
    
    console.log(songs);
    const activeSong = {};
    return(
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black">
            <Header_name/>
        <div className="flex flex-col ml-8 mb-32">
            <div className="w-full flex flex-wrap justify-between items-center sm:flex-row flex-col mt-4">
                <h1 className="font-bold text-4xl text-white text-left">{text_welcome}</h1>
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Canciones</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {songs.map((song, i) => (
                    <SongCard 
                        key={song.id_cancion}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        opcion={handleAbrirModal}
                        idSongModal={setIdSongModal}
                        idSongAlbumModal={setIdSongAlbumModal}
                        i={i}
                    />
                ))}
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Álbumes</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {albumes.map((album, i) => (
                    <AlbumCard 
                        key={album.id_album}
                        album={album}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        i={i}
                    />
                ))}
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Artistas</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {artistas.map((artist, i) => (
                    <ArtistCard 
                        key={artist.id_artista}
                        artist={artist}
                        i={i}
                    />
                ))}
            </div>
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

export default Home;