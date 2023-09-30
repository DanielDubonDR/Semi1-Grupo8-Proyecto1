
import { shuffle } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Service from '../../Service/Service';
import Header_name from "./Header_name";
import SongsAlbum2 from './SongsAlbum2';
import { usePlayer } from "../../context_Player/playerContext";
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

function Radio() {
    const [color, setColor] = React.useState(null);
    const [nombre, setNombre] = useState('');
    const [canciones, setCanciones] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [idSongModal, setIdSongModal] = useState('');
    const [idSongAlbumModal, setIdSongAlbumModal] = useState('');
    const [playlist_seleccionada, setPlaylist_seleccionada] = useState('');
    const [canciones_playlist, setCanciones_playlist] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem("data_user"));
    function suffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const playAlbum = async (e) => {
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
      }


      const { cancionActual, setCancionActual, canc, setCanc, reproduciendose, setReproduciendose } = usePlayer();
    useEffect(() => {
        setColor(shuffle(colors).pop());
        const fetchData = async () => { 
            try {
                const response = await Service.getHomeSongs(usuario.id);
            console.log(response.data);
            
            const shuffledResponse = suffle(response.data["songsWithLike"]);
            console.log(shuffledResponse);
            
            setNombre("Radio");
            setCanciones(shuffledResponse);
        }
        
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData();

    Service.getPlaylists(usuario.id)
        .then((response) => {
            response.data.shift()
            setPlaylists(response.data);
        })
    }, []);

    const openModal = () => {
        setIsModal(true);
    }

    const closeModal = () => {
        setIsModal(false);
    }

    const handleSubmit = (e) => {
    e.preventDefault();
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
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide mb-[100px]">
            <Header_name/>
            <section 
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 relative`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[150px] h-[150px]">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
</svg>

                <div>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{nombre}</h1>
                    <p>Descubre nuevas canciones </p>
                </div>
                <button className="bg-purple hover:bg-purple-700 text-white rounded-full p-3 absolute top-1/2 right-4 transform -translate-y-1/2 shadow-lg" onClick={(e) => playAlbum(e)}>
                    <BsPlayFill className="h-12 w-12" />
                </button>
            </section>

            <div>
                <SongsAlbum2
                canciones={canciones}
                artist={canciones.nombre}
                album={nombre}
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
export default Radio;
