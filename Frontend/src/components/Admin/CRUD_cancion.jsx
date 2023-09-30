import React, { useEffect, useState } from "react";
import { canciones } from "../datos_test/canciones";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../Service/Service";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";

export default function CRUD_cancion() {
  const [data, setData] = useState({});
  const usuario = JSON.parse(sessionStorage.getItem("data_user"));
  const [artista, setArtista] = useState([]);
  const [canciones, setCanciones] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await Service.listarCanciones();
        //console.log("este es el res:", res.data);
        if (res.status === 200) {
          //console.log("este es el res:", res);
          setCanciones(res.data);
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
      } catch
      (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const { logueado, setLogueado } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!logueado) {
      navigate("/login");
    }
  }, [logueado]);

  return (
    <div
      id="profile"
      class="flex h-screen w-full overflow-y-auto bg-gradient-to-t from-silver/40 mb-[100px] scrollbar-hide"
    >
      {Item_CRUD_cancion(canciones, artista)}
    </div>
  );
}

function Item_CRUD_cancion(data, data2) {
  const usuario = JSON.parse(sessionStorage.getItem("data_user"));
  const [canci, setCanci] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const [addSong, setAddSong] = useState(false);
  const [deleteAlbum, setDeleteAlbum] = useState(false);
  const [addAlbum, setAddAlbum] = useState(false);
  //atributos:
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [idCancionG, setIdCancionG] = useState(-1);
  const [id_song, setID] = useState(-1);
  const [songs, setSongs] = useState(-1);
  const [artista, setArtista] = useState([]);
  const [PathImg, setPathImg] = useState("");
  const [PathSong, setPathSong] = useState("");
  const [passw, setPassw] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");

  const [title, setTitle] = useState("");
  const getRowValue = (e) => {
    console.log("HOLIWIS KIWIIIIIIIIS", e);
  };
  
  const [loading, setLoading] = useState(true);

  const obtenerDataArtistas = async () => {
    setLoading(true);
    setCanci(data);
    try {
      const updatedData = await Promise.all(
        data.map(async (item) => {
          const res = await Service.getArtista(item.id_artista);
          console.log("res: ", res);
          if (!(res.status == 200)) {
            console.log("error");
          }
          const artistaData = res.data;
          console.log("artistaData: ", artistaData );
          console.log("item: ", item)
          return { ...item, artistaData };
        })
      );
        console.log("updatedData: ", updatedData);
        setCanci(updatedData); 
        setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDataArtistas();
  }, [data]);


  const [sSong, setSSong] = useState({
    id_cancion: -1,
    nombre: "",
    duracion: "",
    id_imagen: "",
    path_imagen: "",
    path_cancion: "",
    id_obj_cancion: "",
  });

  const openModal = (op, name, artist, img, description, songs, id_song, nombre_Artista) => {
    setName("");
    setArtist("");
    setImg("");
    setDescription("");
    setSongs("");
    setID(-1);
    setIdCancionG(-1);
    setNombreCompleto("");

    if (op === 1) {
      //actualizar
      setShowModal(true);
      setTitle("Actualizar Canción");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setSongs(songs);
      setIdCancionG(id_song);
      setID(id_song);
      setNombreCompleto(nombre_Artista);
    } else if (op === 2) {
      // agregar cancion al álbum
      setAddSong(true);
      setTitle("Administración de canciones");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setIdCancionG(id_song);
      setSongs(songs);
      setNombreCompleto(nombre_Artista);
    } else if (op === 3) {
      //detalle
      setShowModal(true);
      setShowSongs(true);
      setTitle("Detalle");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setSongs(songs);
      setNombreCompleto(nombre_Artista);
    } else if (op === 4) {
      //eliminar
      setDeleteAlbum(true);
      setTitle("Eliminar Canción");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setSongs(songs);
      setID(id_song);
      setNombreCompleto(nombre_Artista);
    } else {
      //agregar
      setAddAlbum(true);
      setTitle("Agregar Canción");
    }
  };

  const DeleteSong = async (e, id) => {
    e.preventDefault();
    console.log("id de la cancion: ", id, usuario.id, passw);
    let data = {
      idUser: usuario.id,
      idSong: id,
      password: passw,
    };

    try {
      let res = await Service.eliminarCancion(data);

      if (res.status === 200 || res.status === 204) {
        toast.success("Canción eliminada con éxito");
        setDeleteAlbum(false);
        window.location.reload();
      } else {
        toast.error("Error al eliminar la canción");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("imagen", file);

      let res = await Service.subirFotoCancion(formData);
      console.log("res de la imagen: ", res.data);
      if (res.status === 200) {
        toast.success("Imagen subida con éxito");
        setImg(res.data.id_imagen);
        setPathImg(res.data.path_imagen);
      } else {
        toast.error("Error al subir la imagen");
      }
    }
  };


  


  const handleSongChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("cancion", file);

      let res = await Service.subirCancion(formData);
      console.log("res de la cancion: ", res.data);
      if (res.status === 200) {
        toast.success("Canción subida con éxito");
        setSongs(res.data.id_cancion);
        setPathSong(res.data.path_cancion);
      } else {
        toast.error("Error al subir la canción");
      }
    }
  };

  const handleActualizacion = async (e) => {
    e.preventDefault();
    let nombre = "";
    let duracion = "";
  
    nombre = name;
    duracion = description;
  
    let datos_Enviar = {
      nombre: nombre,
      duracion: duracion,
      id_artista: artist
    };

    console.log("datos a enviar: ", datos_Enviar);

    let res2 = await Service.updateCancionInfo(datos_Enviar, id_song);
    if (res2.status === 200) {
      toast.success("Canción actualizada con éxito");
      setShowModal(false)
      setShowSongs(false);
      window.location.reload();
    } else {
      toast.error("Error al actualizar la canción");
    }

   
    setShowModal(false)
    setShowSongs(false);
  };

  const handleSongUpdate = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    let idActualizada = "";
    let PathActualizado = "";

    if (file) {
      const formData = new FormData();
      formData.append("cancion", file);

      let res = await Service.subirCancion(formData);

      if (res.status === 200) {
        toast.success("Canción subida con éxito");
        idActualizada = res.data.id_cancion;
        PathActualizado = res.data.path_cancion;
      } else {
        toast.error("Error al subir la canción");
      }
    }

    let datos_Enviar = {
      id_cancion: idActualizada,
      path_cancion: PathActualizado,
    };

    let res2 = await Service.updateCancionCancion(datos_Enviar, id_song);
    if (res2.status === 200) {
      toast.success("Canción actualizada con éxito");
    } else {
      toast.error("Error al actualizar la canción");
    }
  };

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    let idActualizada = "";
    let PathActualizado = "";
    if (file) {
      const formData = new FormData();
      formData.append("imagen", file);

      let res = await Service.subirFotoCancion(formData);
      if (res.status === 200) {
        idActualizada = res.data.id_imagen;
        PathActualizado = res.data.path_imagen;
      } else {
        toast.error("Error al actualizar la imagen");
      }
    }

    let datos_Enviar = {
      id_imagen: idActualizada,
      path_imagen: PathActualizado,
    };

    let res2 = await Service.updateCancionImagen(datos_Enviar, id_song);

    if (res2.status === 200) {
      toast.success("Imagen actualizada con éxito");
    } else {
      toast.error("Error al actualizar la imagen");
    }
    
  };

  const [fData, setFData] = useState({
    nombre: "",
    id_artista: "",
    duracion: "",
    path_imagen: "",
    id_imagen: "",
    id_cancion: "",
    path_cancion: "",
  });

  const handleInputChange = async (event) => {
    setFData({
      ...fData,
      [event.target.name]: event.target.value,
    });

    console.log("fData: ", fData);
  };

  const handleNameChange = async (event) => {
    setName(event.target.value);
  };

  const handleArtistChange = async (event) => {
    console.log("event.target.value.id_artista: ", event.target.value);
    setArtist(event.target.value);
    console.log("artist: ", artist);
  };

  const handleDuracionChange = async (event) => {
    setDuracion(event.target.value);
  };

  const handlePasswChange = async (event) => {
    setPassw(event.target.value);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    let cancionID = songs;
    let ImgID = img;

    fData.id_imagen = ImgID;
    fData.id_artista = artist;
    fData.id_cancion = cancionID;
    fData.path_imagen = PathImg;
    fData.path_cancion = PathSong;

    console.log("fData: ", fData);

    setImg("");
    setSongs("");

    setPathImg("");
    setPathSong("");

    let res = await Service.crearCancion(fData);
    console.log("res de la creación: ", res.data);
    if (res.status === 200) {
      toast.success("Canción creada con éxito");
      window.location.reload();
    } else {
      toast.error("Error al crear la canción");
    }

    setAddAlbum(false);
  };

  return (

    <>
      <div>
        <ToastContainer />
      </div>
      <div class="flex h-full w-screen ">
        <div class="m-auto content-center">
          <section className="flex items-end h-50 text-white p-8 ">
            <div class="md:flex md:items-center place-content-between ltr:ml-3 rtl:mr-3">
              <h1 className="md:w-flex text-2xl xl:text-5xl font-bold ">
                Gestión de Canciones
              </h1>
              <img
                src="http://imgfz.com/i/CMi7hQ4.png"
                class="w-12 h-12 ms-12"
              ></img>
            </div>
          </section>
          <div class=" bg-gradient-to-t from-black2 dark:black relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div class="w-full md:auto ">
                <form class="flex space-x-4 items-center">
                  <label for="simple-search" class="sr-only">
                    Search
                  </label>
                  <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    </div>
                  </div>
                  <div class="w-full md:w-auto  space-y-2 md:space-y-0  flex-shrink-0">
                    <button
                      type="button"
                      class="flex  text-white bg-primary-700 hover:bg-purple focus:ring-4 focus:ring-primary-300 font-medium rounded-lg  text-sm px-4 py-2 dark:bg-purple dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                      onClick={() => openModal(5, "", "", "", "", "")}
                    >
                      <svg
                        class="h-3.5 w-3.5 mr-2"
                        fill="currentColor"
                        viewbox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                      </svg>
                      Agregar Cancion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
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
                    Actualizar
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Delete
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Detalle
                  </th>
                </tr>
              </thead>
              {
                loading ? (
                  <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        </div>
                ):(<tbody>
                  {canci.map((value, index) => (
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
                      <td class="px-6 py-4">{value.artistaData?.nombres + " " + value.artistaData?.apellidos}</td>
                      <td class=" text-center">
                        <button
                          class="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded "
                          onClick={() =>
                            openModal(
                              1,
                              value.nombre,
                              value.id_artista,
                              value.path_imagen,
                              value.duracion,
                              value.path_cancion,
                              value.id_cancion,
                              value.artistaData?.nombres + " " + value.artistaData?.apellidos
                            )
                          }
                        >
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                        </button>
                      </td>
  
                      <td class="px-6 py-4 text-right">
                        <button
                          class="bg-red-700 hover:bg-red-950 text-white font-bold py-2 px-4 rounded"
                          onClick={() =>
                            openModal(
                              4,
                              value.nombre,
                              value.id_artista,
                              value.path_imagen,
                              value.duracion,
                              value.path_cancion,
                              value.id_cancion,
                              value.artistaData?.nombres + " " + value.artistaData?.apellidos
                            )
                          }
                        >
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
  
                      <td class="px-6 py-4 text-right">
                        <button
                          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  "
                          onClick={() =>
                            openModal(
                              3,
                              value.nombre,
                              value.id_artista,
                              value.path_imagen,
                              value.duracion,
                              value.path_cancion,
                              value.id_cancion,
                              value.artistaData?.nombres + " " + value.artistaData?.apellidos
                            )
                          }
                        >
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
                              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>)
              }
              
            </table>
          </div>

          {showModal ? (
            <>
              <div className="shadow-[0_2px_15px_-3px_rgba(255,255,255.07),0_10px_20px_-2px_rgba(255,255,255,0.04)] justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div className=" relative w-7/12 my-6 mx-auto">
                  {/*content*/}
                  <div className="border-2 rounded-r-lg shadow-lg relative flex flex-col w-full bg-black3 outline-silver border-black/75">
                    {/*header*/}
                    <div className=" flex text-white items-start justify-between p-5 border-b border-solid border-purple rounded-t">
                      <h3 className="text-2xl font-semibold">{title}</h3>
                      <button
                        className="p-1 ml-auto text-dark  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => {
                          setShowModal(false), setShowSongs(false);
                        }}
                      >
                        <span className=" text-red-500  h-6 w-6 text-2xl block outline-none focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 22 22"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                    {/*body*/}

                    <div className="w-full bg-black2 items-center justify-center">
                      <img
                        className=" mx-auto rounded-lg object-fill h-48 w-48 my-2"
                        src={img}
                        alt=""
                      />

                      {!showSongs ? (
                        <div className="flex flex-col items-center justify-center">
                          <input
                            className="mt-6 text-white rounded-lg bg-purple"
                            type="file"
                            accept="image/*" // Accept only image files
                            onChange={handleImageUpdate}
                            required
                          />

                          <div class=" w-full col-span-2">
                            <div class=" space-y-2">
                              <div class="flex items-center justify-center w-full">
                                <label class="text-sm font-bold text-gray-500 tracking-wide">
                                  Agrega una canción
                                </label>
                                <input
                                  className="mt-6 ml-4 text-white rounded-lg bg-lightPurple"
                                  type="file"
                                  accept=".mp3" // Accept specific audio file formats
                                  onChange={handleSongUpdate}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {!showSongs ? (
                      <div className="relative p-6 flex-auto">
                        <div class="w-full ">
                          <form class="w-full " onSubmit={(e) => handleActualizacion(e)}>
                            <div class="grid grid-cols-2 gap-2">
                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Título
                                  </label>
                                </div>
                                <div class="w-full mr-4">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    name="nombre"
                                    defaultValue={name}
                                    onChange={handleNameChange}

                                  ></input>
                                </div>
                              </div>

                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Artista
                                  </label>
                                </div>
                                <div class="w-full mr-4">
                                <select class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" onChange={handleArtistChange} value={artist}>
                                {data2.map((value, index) => (
                                <option 
                                key={value.id_artista}
                                value={value.id_artista}
                                defaultValue="Selecciona un artista"
                                >
                                  {value.nombres + " " + value.apellidos}
                                </option>
                                ))}
                              </select>
                                </div>
                              </div>

                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Duración
                                  </label>
                                </div>
                                <div class="w-full mr-[50px]">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    name="duracion"
                                    defaultValue={description}
                                    onChange={handleDuracionChange}
                                  ></input>
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              class="text-white bg-gradient-to-br from-purple to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                            >
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
                                  d="M4.5 12.75l6 6 9-13.5"
                                />
                              </svg>
                              Guardar
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <div className="relative p-6 flex-auto">
                        <div class="w-full ">
                          <form class="w-full grid grid-cols-2 grid-rows-2 gap-4">
                            <div class="row-span-3">
                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Nombre
                                  </label>
                                </div>
                                <div class="w-full ">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    defaultValue={name}
                                    readOnly={true}
                                  ></input>
                                </div>
                              </div>

                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Artista
                                  </label>
                                </div>
                                <div class="w-full ">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    defaultValue={nombreCompleto}
                                    readOnly={true}
                                  ></input>
                                </div>
                              </div>

                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Duración
                                  </label>
                                </div>
                                <div class="w-full mr-[150px]">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    defaultValue={description}
                                    readOnly={true}
                                  ></input>
                                </div>
                              </div>
                            </div>

                            <h1 className="text-white font-bold text-3xl ml-4">
                              Escuchar
                            </h1>
                            <audio controls className="ml-6">
                              <source src={songs} type="audio/mpeg" />
                            </audio>

                            {/*Termina detalle */}
                          </form>
                        </div>
                      </div>
                    )}

                    {/*footer*/}
                    <div className="flex items-center justify-end p-1 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setShowModal(false), setShowSongs(false);
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}

          {/* MODAL ELIMINACIÓN */}
          {deleteAlbum ? (
            <>
              <div className="shadow-[0_2px_15px_-3px_rgba(255,255,255.07),0_10px_20px_-2px_rgba(255,255,255,0.04)] justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div className=" relative w-7/12 my-6 mx-auto">
                  {/*content*/}
                  <div className="border-2 rounded-r-lg shadow-lg relative flex flex-col w-full bg-black3 outline-silver border-black/75">
                    {/*header*/}
                    <div className=" flex text-white items-start justify-between p-5 border-b border-solid border-purple rounded-t">
                      <h3 className="text-2xl font-semibold">{title}</h3>
                      <button
                        className="p-1 ml-auto text-dark  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => {
                          setDeleteAlbum(false);
                        }}
                      >
                        <span className=" text-red-500  h-6 w-6 text-2xl block outline-none focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 22 22"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                    {/*body*/}

                    <div className="w-full bg-black2 items-center justify-center">
                      <img
                        className=" mx-auto rounded-lg object-fill h-48 w-48 my-2"
                        src={img}
                        alt=""
                      />
                    </div>

                    <div className="relative p-6 flex-auto text-center">
                      <h1 class="inline-block text-xl md:w-flex text-white py-5">
                        ¿Está seguro de querer eliminar la canción{" "}
                        <span class="inline-block text-xl text-red-500 font-bold">
                          {" "}
                          {name}
                        </span>
                        ?
                      </h1>{" "}
                      <div class=" md:items-center mb-2">
                        <div class="">
                          <label
                            class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                            for="inline-full-name"
                          >
                            Confirme su contraseña:
                          </label>
                        </div>
                        <form
                          className="justify-center"
                          onSubmit={(e) => DeleteSong(e, id_song)}
                        >
                          <div class="w-full ">
                            <input
                              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              id="inline-full-name"
                              type="password"
                              
                              onChange={handlePasswChange}
                            ></input>
                          </div>

                          <div class="">
                            <button
                              type="submit"
                              class="text-white mt-4 bg-gradient-to-br from-red-900 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                            >
                              Eliminar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-1 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          {
                            setDeleteAlbum(false);
                          }
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}

          {/* MODAL AGREGAR */}
          {addAlbum ? (
            <>
              <div className="shadow-[0_2px_15px_-3px_rgba(255,255,255.07),0_10px_20px_-2px_rgba(255,255,255,0.04)] justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div className=" relative w-7/12 my-6 mx-auto">
                  {/*content*/}
                  <div className="border-2 rounded-r-lg shadow-lg relative flex flex-col w-full bg-black3 outline-silver border-black/75">
                    {/*header*/}
                    <div className=" flex text-white items-start justify-between p-5 border-b border-solid border-purple rounded-t">
                      <h3 className="text-2xl font-semibold">{title}</h3>
                      <button
                        className="p-1 ml-auto text-dark  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => {
                          setAddAlbum(false);
                        }}
                      >
                        <span className=" text-red-500  h-6 w-6 text-2xl block outline-none focus:outline-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 22 22"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <form onSubmit={(e)=> handleAdd(e)}>
                      <div className="w-full bg-black2 items-center justify-center">
                        <div class=" w-full p-5 rounded-xl z-10">
                          <div class="grid grid-cols-1 space-y-2">
                            <label class="text-sm font-bold text-gray-500 tracking-wide">
                              Agrega una imagen
                            </label>
                            <input
                              className="mt-6 text-white rounded-lg bg-purple"
                              type="file"
                              accept="image/*" // Accept only image files
                              onChange={handleImageChange}
                              required
                            />
                          </div>
                          <p class="text-sm text-gray-300"></p>

                          <div class=" w-full col-span-2">
                            <div class=" ">
                              <label class="text-sm font-bold text-gray-500 tracking-wide">
                                Agrega una canción
                              </label>
                              <input
                                className="mt-6 ml-4 text-white rounded-lg bg-purple"
                                type="file"
                                accept=".mp3" // Accept specific audio file formats
                                onChange={handleSongChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative p-6 flex-auto">
                        <div class="w-full ">
                          <div class="md:flex md:items-center mb-6">
                            <div class="">
                              <label
                                class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                for="inline-full-name"
                              >
                                Nombre:
                              </label>
                            </div>
                            <div class="w-full mr-[250px]">
                              <input
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                name="nombre"
                                defaultValue={fData.nombre}
                                onChange={handleInputChange}
                              ></input>
                            </div>
                          </div>

                          <div class="md:flex md:items-center mb-6">
                            <div class="">
                              <label
                                class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                for="inline-full-name"
                              >
                                Artista:
                              </label>
                            </div>
                            <div class="w-full mr-[250px]">
                            <select class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" onChange={handleArtistChange} value={artist} defaultValue="default">
                              <option value="default">Selecciona un Artista</option>
                                {data2.map((value, index) => (
                                <option 
                                key={value.id_artista}
                                value={value.id_artista}
                                >
                                  {value.nombres + " " + value.apellidos}
                                </option>
                                ))}
                              </select>
                              
                            </div>
                          </div>
                          <label
                            class="block text-white font-bold md:text-left mb-1 md:mb-2 pr-4"
                            for="inline-full-name"
                          >
                            Duración de la canción
                          </label>
                          <div class="md:flex md:items-center mb-6">
                            <div class=""></div>
                            <div class="w-full ">
                              <textarea
                                class="bg-gray-200 appearance-none h-8 overflow-y-auto border-2 border-gray-200 rounded w-full py- px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                name="duracion"
                                defaultValue={fData.duracion}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          class="text-white bg-gradient-to-br from-purple to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                        >
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
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          Guardar
                        </button>
                      </div>
                    </form>

                    {/*footer*/}
                    <div className="flex items-center justify-end p-1 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setAddAlbum(false);
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}

          {/* MODAL ACTUALIZAR */}
        </div>
      </div>
    </>
  );
}
