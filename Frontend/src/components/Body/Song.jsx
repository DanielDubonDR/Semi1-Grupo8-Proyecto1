import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlay, BsPlusCircle } from "react-icons/bs";
import { toast } from 'react-toastify';
import Service from "../../Service/Service";
import { usePlayer } from "../../context_Player/playerContext";
import convertirFechaParaSQL from "../../utils/utils";

function Song({order, track, artist, opcion,idSongModal,idSongAlbumModa}){
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [album, setAlbum] = useState('');
    const [duracion, setDuracion] = useState('');
    const [nombres, setNombres] = useState('');
    const [song, setSong] = useState([]);
    const { cancionActual, setCancionActual, canc, setCanc, reproduciendose, setReproduciendose } = usePlayer();
    useEffect(() => {
        Service.getAlbum(track.id_album)
        .then(response => {
            setAlbum(response.data.nombre);
        })

        Service.getCancion(track.id_cancion)
        .then(response => {
            setSong(response.data);
            setDuracion(response.data.duracion);
        })
        setNombres(artist.nombres +" "+ artist.apellidos);
        setIsLiked(track.isLiked)
    }, [])
    const handleMouseEnter = () => {
        setShowMessage(true);
    };
    console.log(nombres)

    const handleSetSong = async (cancion) => {
        try {
        setCancionActual(cancion);
        setCanc([cancion])
        const hoy = new Date();
          let values = {
            id_cancion: cancion.id_cancion,
            id_album: cancion.id_album,
            id_usuario: JSON.parse(localStorage.getItem('data_user')).id,
            fecha: convertirFechaParaSQL(hoy)
          }
          console.log(values);
          let res = await Service.postReproduccion(values);
          console.log(res.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setReproduciendose(true);
      };
    const handleMouseLeave = () => {
    setShowMessage(false);
    };
    const toggleLike = () => {
        if(isLiked==false){
            const data = {
                id_cancion: track.id_cancion,
                id_album: track.id_album,
                id_usuario: JSON.parse(localStorage.getItem('data_user')).id
            }
            Service.addFavorito(data)
            .then(response => {
                if(response.data.status){
                    toast.success('Se añadió tu canción a Favoritos!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    setIsLiked(true);
                    setTimeout(() => {
                        navigate('/user/home');
                    },1000)
                }else{
                    toast.error('Ocurrio un Error!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    }
            })
        }else{
            const data = {
                id_cancion: track.id_cancion,
                id_usuario: JSON.parse(localStorage.getItem('data_user')).id
            }
            Service.deleteFavorito(data)
            .then(response => {
                if(response.data.status){
                    toast.success('Se eliminó tu canción de Favoritos!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    setIsLiked(false);
                    setTimeout(() => {
                        navigate('/user/home');
                    },1000)
                }else{
                    toast.error('Ocurrio un Error!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                    }
            })
        }
    };
    const handleMouseEnterFavorite = () => {
        if (isLiked) {
            setShowMessage2(true); // Mostrar "Quitar de favoritos"
        } else {
            setShowMessage1(true); // Mostrar "Añadir a favoritos"
        }
    };

    const handleOptionPlaylist = () => {
        opcion()
        idSongModal(track.id_cancion)
        idSongAlbumModal(track.id_album)
    }

    const handleMouseLeaveFavorite = () => {
        setShowMessage1(false);
        setShowMessage2(false);
    };
    return (
        <div className="grid grid-cols-3 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer" >
            <div className="flex items-center space-x-4 ">
                <p>{order +1}</p>
                <img 
                    className="h-10 w-10" 
                    src={track.path_imagen} 
                    alt="" 
                />

                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.songName}</p>
                    <p>{nombres}</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
            <p className="flex-grow w-12 hidden md:inline">{album}</p>
            </div>
            <div className="flex items-center justify-between">

                <div
                    className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative" // Añadida la clase "relative"
                    onClick={toggleLike}
                    onMouseEnter={handleMouseEnterFavorite}
                    onMouseLeave={handleMouseLeaveFavorite}
                >
                    {isLiked ? <AiFillHeart className="text-xl text-lightPurple" /> : <AiOutlineHeart className="text-xl" />}
                    
                    {showMessage1 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2"> 
                            Añadir a favoritos
                        </div>
                    )}

                    {showMessage2 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2">
                            Quitar de favoritos
                        </div>
                    )}
                </div>
                <div
                    className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative" // Añadida la clase "relative"
                    onClick={handleOptionPlaylist}
                >
                    <BsPlusCircle className="text-xl" />
                    {/*isLiked ? <AiFillHeart className="text-xl text-lightPurple" /> : <AiOutlineHeart className="text-xl" />*/}
                    
                    {/*showMessage3 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2"> 
                            Añadir a una Playlist
                        </div>
                    )*/}
                </div>

                <p>{duracion}</p>
                <div className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative">
                    <BsPlay className="text-xl" onClick={()=> handleSetSong(song)}/>
                </div>
            </div>
        </div>
    )
}

export default Song;