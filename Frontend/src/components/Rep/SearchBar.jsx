import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/Service";
import { useUserContext } from "../../context/UserContext";
import { usePlayer } from "../../context_Player/playerContext";
import { ToastContainer, toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import convertirFechaParaSQL from "../../utils/utils";
import { BsPlay, BsPlusCircle } from "react-icons/bs";
import { set } from "lodash";

export default function Navbar({ fixed }) {
  const { logueado, setLogueado } = useUserContext();
  const { cancionActual, setCancionActual, canc, setCanc, reproduciendose, setReproduciendose } = usePlayer();
  const navigate = useNavigate();
  const [cancionesB, setCancionesB] = useState([]);
  const [albums, setAlbumes] = useState([]);
  const [artista, setArtista] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [playlist_seleccionada, setPlaylist_seleccionada] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [canciones_playlist, setCanciones_playlist] = useState([]);
  const [idSongModal, setIdSongModal] = useState('');
  const [idSongAlbumModal, setIdSongAlbumModal] = useState('');
  const [response, setResponse] = useState('');
  const usuario = JSON.parse(localStorage.getItem('data_user'));
  const handleSelectChange = (e) => {
    console.log("QUIERO REVISAR: ", e.target.value)
    setPlaylist_seleccionada(e.target.value);
    if(e.target.value !== ''){
        Service.getCancionesPlaylist(e.target.value, usuario.id)
        .then(response => {
            setCanciones_playlist(response.data);
        })
    }
}

const handleAddSongtoPlaylist = (e) => {
  e.preventDefault();
  if(playlist_seleccionada === ''){
      toast.error('Debe seleccionar una playlist', {
          position: "top-right",
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
          position: "top-right",
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
              position: "top-right",
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
              position: "top-right",
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
          position: "top-right",
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

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await Service.getHomeSongs(usuario.id);
        console.log("este es el res:", res.data['songsWithLike']);

        if (res.status === 200) {
          //console.log("este es el res:", res);
          setCancionesB( res.data['songsWithLike']);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        let res = await Service.listarArtistas();
        console.log("este es el res de los artistas:", res.data);

        if (res.status === 200) {
          setArtista(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      try {
        let res = await Service.listarAlbumes();
        //console.log("este es el res:", res.data);
        if (res.status === 200) {
          //console.log("este es el res:", res);
          setAlbumes(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    Service.getPlaylists(usuario.id)
        .then((response) => {
            response.data.shift()
            setPlaylists(response.data);
        })


    fetchData();

    setResponse("");
  }, [response]);

  const filteredCanciones = cancionesB.filter((cancion) =>
  cancion.nombre.toLowerCase().includes(searchText.toLowerCase()) || cancion.nombre_artista.toLowerCase().includes(searchText.toLowerCase())
);



const handleClickArtista = (e) => {
  navigate(`/user/artista/${e}`)
}

const handleClickAlbum = (e) => {
  navigate(`/user/album/${e}`)
}

const handleSetSong = async (cancion) => {
  try {
  setCancionActual(cancion);
  setCanc([cancion])

  const hoy = new Date();

      let values = {
        id_cancion: cancion.id_cancion,
        id_album: cancion.id_album,
        id_usuario: usuario.id,
        fecha: convertirFechaParaSQL(hoy)
      };
    console.log(values);
    let res = await Service.postReproduccion(values);
    console.log(res.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  setReproduciendose(true);
};

const playAlbum = async (album) => {
  console.log(album);
  try {
    const res = await Service.listarCancionesAlbum(album.id_album);
    console.log(res.data);
    setCanc(res.data);
    setCancionActual(res.data[0]);
    const hoy = new Date();

      let values = {
        id_cancion: cancionActual.id_cancion,
        id_album: cancionActual.id_album,
        id_usuario: usuario.id,
        fecha: convertirFechaParaSQL(hoy)
      };
    console.log(values);
    let res2 = await Service.postReproduccion(values);
    setReproduciendose(true);
    console.log(res.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
}

const toggleLike = (cancion) => {
  if(cancion.isLiked==false){
      const data = {
          id_cancion: cancion.id_cancion,
          id_album: cancion.id_album,
          id_usuario: JSON.parse(localStorage.getItem('data_user')).id
      }
      Service.addFavorito(data)
      .then(response => {
          if(response.data.status){
              toast.success('Se añadió tu canción a Favoritos!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  });
                  cancion.isLiked = true;
                  setResponse("cambio");
          }else{
              toast.error('Ocurrio un Error!', {
                  position: "top-right",
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
                  position:"top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  });
              cancion.isLiked = false;
              setTimeout(() => {
                  navigate('/user/home');
              },1000)
          }else{
              toast.error('Ocurrio un Error!', {
                  position: "top-right",
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

const filteredAlbums = albums.filter((album) =>
  album.nombre.toLowerCase().includes(searchText.toLowerCase()) //|| album.artista.toLowerCase().includes(searchText.toLowerCase())
);

const filteredArtistas = artista.filter((artista) =>
  (artista.nombres + ' ' + artista.apellidos)
    .toLowerCase()
    .includes(searchText.toLowerCase())
);

const handleOptionPlaylist = (id, idA) => {
  handleAbrirModal()
  setIdSongModal(id)
  setIdSongAlbumModal(idA)
}

const handleCancelarModal = (e) => {
  e.preventDefault();
  closeModal();
}

const handleAbrirModal = () => {
  openModal()
}

const handleSubmit = (e) => {
  e.preventDefault();
  closeModal();
};

const openModal = () => {
  setIsModal(true);
};

const closeModal = () => {
  setIsModal(false);
};


  useEffect(() => {
    if (!logueado) {
      navigate("/login");
    }
  }, [logueado]);


  return (
    <>
      <div className="w-full bg-black2  mb-[100px] overflow-y-auto scrollbar-hide">
        <nav class="sticky top-0 bg-gradient-to-r from-lightPurple via-purple to-lightPurple dark:bg-gray-900 z-30 w-full px-2 py-4 shadow-[0_30px_30px_-15px_rgba(0,0,0,0.8)]">
          <div class="grid gap-6 md:grid-cols-3 ">
            <div>
              <span class="self-center text-2xl font-semibold whitespace-nowrap text-white"></span>
            </div>
            
            <div class="relative hidden md:block">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span class="sr-only">Search icon</span>
              </div>
              <input
                type="text"
                id="search-navbar"
                class="block w-full p-2 pl-10 text-sm text-silver border border-silver rounded-lg bg-gray-50 focus:ring-purple focus:border-black dark:bg-silver dark:border-gray-600 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Búsqueda"
                value={searchText}
                onChange={handleInputChange}
              ></input>
            </div>
            <div></div>
          </div>
        </nav>
        <ToastContainer />
        <div className="py-8 px-8">
          <div class="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
            <h1 class="text-2xl font-semibold text-white dark:text-white"> CANCIONES </h1>
            <table class="w-full text-sm text-left text-white dark:text-gray-400 py-2">
              <thead class="text-xs text-white uppercase bg-gray-50 dark:bg-black3 dark:text-white">
                <tr>
                  <th scope="col" class="px-6 py-3 "></th>
                  <th scope="col" class="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Artista
                  </th>
                  <th scope="col" class="px-6 py-3">
                  </th>

                  <th scope="col" class="px-6 py-3">
                  </th>

                  <th scope="col" class="px-6 py-3">
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCanciones.map((value, index) => (
                  <tr class="bg-white border-b dark:bg-black2 dark:border-black hover:h_black dark:hover:bg-h_black">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="w-24 h-24 rounded-r-lg"
                        src={value.path_imagen}
                        alt="artista"
                      ></img>
                    </th>

                    <td class="px-6 py-4">{value.nombre}</td>
                    <td class="px-6 py-4">{value.nombre_artista}</td>
                    <td class="px-6 py-4">
                      <td class="px-6 py-4 text-right">
                        <button class="bg-purple hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full" onClick={()=> handleSetSong(value)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                            />
                          </svg>
                        </button>
                      </td>

                    </td>
                    <td class="px-6 py-4"><div
                    className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative" // Añadida la clase "relative"
                    onClick={()=>toggleLike(value)}
                    //onMouseEnter={handleMouseEnterFavorite}
                   // onMouseLeave={handleMouseLeaveFavorite}
                >
                    {value.isLiked ? <AiFillHeart className="text-xl text-lightPurple" /> : <AiOutlineHeart className="text-xl" />}
                    
                    {/*showMessage1 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2"> 
                            Añadir a favoritos
                        </div>
                    )*/}

                    {/*showMessage2 && (
                        <div className="bg-gray-900 text-white py-1 px-2 rounded-md absolute top-10 left-0 mt-2 ml-2">
                            Quitar de favoritos
                        </div>
                    )*/}
                </div></td>
                    <td class="px-6 py-4"><div
                    className="text-gray-500 hover:text-lightPurple flex items-center justify-center relative" // Añadida la clase "relative"
                    onClick={()=>handleOptionPlaylist(value.id_cancion, value.id_album)}
                >
                    <BsPlusCircle className="text-xl" />
                    
                </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="py-8 px-8">
          <div class="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
            <h1 class="text-2xl font-semibold text-white dark:text-white"> ALBUMES </h1>
            <table class="w-full text-sm text-left text-white dark:text-gray-400 py-2">
              <thead class="text-xs text-white uppercase bg-gray-50 dark:bg-black3 dark:text-white">
                <tr>
                  <th scope="col" class="px-6 py-3 "></th>
                  <th scope="col" class="px-6 py-3">
                    Nombre
                  </th>

                  <th scope="col" class="px-6 py-3">
                    PLAY
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlbums.map((value, index) => (
                  <tr class="bg-white border-b dark:bg-black2 dark:border-black hover:h_black dark:hover:bg-h_black" onClick={()=> handleClickAlbum(value.id_album)}>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="w-24 h-24 rounded-r-lg"
                        src={value.path_imagen}
                        alt="artista"
                      ></img>
                    </th>

                    <td class="px-6 py-4">{value.nombre}</td>
                    <td class="px-6 py-4">
                      <td class="px-6 py-4 text-right">
                        <button class="bg-purple hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full  " onClick={()=>playAlbum(value)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                            />
                          </svg>
                        </button>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="py-8 px-8">
          <div class="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
            <h1 class="text-2xl font-semibold text-white dark:text-white"> ARTISTAS </h1>
            <table class="w-full text-sm text-left text-white dark:text-gray-400 py-2">
              <thead class="text-xs text-white uppercase bg-gray-50 dark:bg-black3 dark:text-white">
                <tr>
                  <th scope="col" class="px-6 py-3 "></th>
                  <th scope="col" class="px-6 py-3">
                    Nombre
                  </th>

                  <th scope="col" class="px-6 py-3">
                    FECHA DE NACIMIENTO
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredArtistas.map((value, index) => (
                  <tr class="bg-white border-b dark:bg-black2 dark:border-black hover:h_black dark:hover:bg-h_black" onClick={()=>handleClickArtista(value.id_artista)}>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="w-24 h-24 rounded-r-lg"
                        src={value.path_fotografia}
                        alt="artista"
                      ></img>
                    </th>

                    <td class="px-6 py-4">{value.nombres + " " + value.apellidos}</td>
                    <td class="px-6 py-4">
                      <td class="px-6 py-4 text-right">
                        {formatDate(value.fecha_nac)}
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Selecciona la playlist a agregar</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  PLAYLIST
                </label>
                <select
                  className="block appearance-none w-full bg-white border border-lightPurple text-black hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  id="example-select"
                  value={playlist_seleccionada}
                  onChange={handleSelectChange}
                >
                  <option selected={true} className="text-black" value="">
                    Selecciona una playlist
                  </option>
                  {playlists.map((playlist, i) => (
                    <option
                      className="text-black"
                      key={playlist.id_playlist}
                      value={playlist.id_playlist}
                    >
                      {playlist.nombre}
                    </option>
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
      </div>

    </>
  );
}
