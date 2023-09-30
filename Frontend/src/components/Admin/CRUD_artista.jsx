import React, { useEffect, useState } from "react";
import { profiles } from "../datos_test/artistas";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../Service/Service";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";

export default function CRUD_artistas() {
  const [data, setData] = useState({});
  const usuario = JSON.parse(sessionStorage.getItem("data_user"));

  const [artistas, setArtistas] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await Service.listarArtistas();

        if (res.status == 200) {
          setArtistas(res.data);
        }
      } catch (error) {
        console.log(error);
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
      class="flex h-screen w-screen overflow-y-auto bg-gradient-to-t from-lightPurple/50 scrollbar-hide mb-[100px]"
    >
      {Item_CRUD_artistas(artistas)}
    </div>
  );
}



function Item_CRUD_artistas(data) {
  const usuario = JSON.parse(sessionStorage.getItem("data_user"));
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("file: ", file);
    setSelectedImage(file);
  };

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await Service.actualizarArtistaImagen(formData, id_artist);
      if (res.status == 200) {
        toast.success("La imagen ha sido actualizada correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - la imagen no ha sido actualizada.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    
    
  }


  const showToastMessageError = () => {
    toast.error("Ha ocurrido un error - la canción no ha sido eliminada.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageSuccess = () => {
    toast.success("La canción ha sido eliminada correctamente.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const [addSong, setAddSong] = useState(false);
  const [deleteAlbum, setDeleteAlbum] = useState(false);
  const [addAlbum, setAddAlbum] = useState(false);

  const [album, setAlbum] = useState([]);
  //atributos:
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPathImg, setSelectedPathImg] = useState(null);
  const [title, setTitle] = useState("");
  const [id_artist, setId_artist] = useState(-1);
  const [passw, setPassw] = useState("");

  useEffect(() => {
    obtDatos();
  }, []);

  const handleNameChange = async (event) => {
    setName(event.target.value);
  };

  const handlePasswChange = async (event) => {
    setPassw(event.target.value);
  };

  const handleArtistChange = async (event) => {
    setArtist(event.target.value);
  };

  const handleDescriptionChange = async (event) => {
    setDescription(event.target.value);
  };


  const DeleteArtist = async (id, e) => {
    e.preventDefault();
    try {
      let datos = {
        idArtist : id,
        idUser : usuario.id,
        password : passw
      }
      const res = await Service.eliminarArtista(datos);

      if (res.status == 200) {
        toast.success("El artista ha sido eliminado correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - el artista no ha sido eliminado.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    window.location.reload();
  };

  const handleActualizacion = async (e) => { 
    e.preventDefault();
    let datos_Enviar = {
      nombres: name,
      apellidos: description,
      fecha_nac: artist,
    };

    try {
      const res = await Service.actualizarArtista(datos_Enviar, id_artist);
      if (res.status == 200) {
        toast.success("El artista ha sido actualizado correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        window.location.reload();
        setShowSongs(false);
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - el artista no ha sido actualizado.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
  
    return `${day}-${month}-${year}`;
  }

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
  
    return `${year}-${month}-${day}`;
  };


  const obtDatos = async () => {
    setAlbum(data);

    /*const respose = await fetch(URL);
    setAlbum(await respose.data);*/
  };
  const getRowValue = (e) => {
    console.log("HOLIWIS KIWIIIIIIIIS", e);
  };

  const [fData, setFData] = useState({
    nombres: "",
    apellidos: "",
    path_imagen: "",
    fecha_nac: "",
  });

  const handleInputChange = async (event) => {
    console.log("event.target.name: ", event.target.name);
    setFData({
      ...fData,

      [event.target.name]: event.target.value,
    });

    console.log("fData: ", fData);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombres", fData.nombres);
    formData.append("apellidos", fData.apellidos);
    formData.append("imagen", selectedImage);
    formData.append("fecha_nac", fData.fecha_nac);

    try {
      const res = await Service.crearArtista(formData);
      if (res.status == 200) {
        toast.success("El artista ha sido creado correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - el artista no ha sido creado.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setFData({
      nombres: "",
      apellidos: "",
      path_imagen: "",
      id_imagen: "",
      fecha_nac: "",
    });
    window.location.reload();

    setAddAlbum(false);
  };

  const openModal = (op, name, artist, img, description, songs) => {
    setName("");
    setArtist("");
    setImg("");
    setDescription("");
    setId_artist(-1);

    if (op === 1) {
      //actualizar
      setShowModal(true);
      setTitle("Actualizar perfil del Artista");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setId_artist(songs);
    } else if (op === 2) {
      // agregar cancion al álbum
      setAddSong(true);
      setTitle("Administración de Artistas");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setId_artist(songs);
    } else if (op === 3) {
      //detalle
      setShowModal(true);
      setShowSongs(true);
      setTitle("Detalle del Artista");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setId_artist(songs);
    } else if (op === 4) {
      //eliminar
      setDeleteAlbum(true);
      setTitle("Eliminar Artista");
      setName(name);
      setArtist(artist);
      setImg(img);
      setDescription(description);
      setId_artist(songs);
    } else {
      //agregar
      setAddAlbum(true);
      setTitle("Agregar Artista");
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div class="flex h-full w-screen">
        <div class="m-auto content-center">
          <section className="flex items-end h-50 text-white p-8 ">
            <div class="md:flex md:items-center place-content-between ltr:ml-3 rtl:mr-3">
              <h1 className="md:w-flex text-2xl xl:text-5xl font-bold ">
                Gestión de Artistas
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
                      Agregar Artista
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-white dark:text-gray-400">
              <thead class="text-xs text-white uppercase bg-gray-50 dark:bg-black3 dark:text-white">
                <tr>
                  <th scope="col" class="px-6 py-3 "></th>
                  <th scope="col" class="px-6 py-3">
                    Nombre
                  </th>
                  
                  <th scope="col" class="px-6 py-3">
                    Fecha de Nacimiento
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
              <tbody>
                {data.map((value, index) => (
                  <tr class="bg-white border-b dark:bg-black2 dark:border-black hover:h_black dark:hover:bg-h_black">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="w-24 h-24 rounded-full"
                        src={value.path_fotografia}
                        alt="artista"
                      ></img>
                    </th>

                    <td class="px-6 py-4">
                      {value.nombres + " " + value.apellidos}
                    </td>
                    <td class="px-6 py-4">{formatDate(value.fecha_nac)}</td>
                    <td class=" text-center">
                      <button
                        class="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded "
                        onClick={() =>
                          openModal(
                            1,
                            value.nombres,
                            value.fecha_nac,
                            value.path_fotografia,
                            value.apellidos,
                            value.id_artista
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
                            value.nombres,
                            value.fecha_nac,
                            value.path_fotografia,
                            value.apellidos,
                            value.id_artista
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
                            value.nombres,
                            value.fecha_nac,
                            value.path_fotografia,
                            value.apellidos,
                            value.id_artista
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
              </tbody>
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
                        className=" mx-auto rounded-full object-fill h-48 w-48 my-2"
                        src={img}
                        alt=""
                      />

                      {!showSongs ? (
                        <div className="flex flex-col items-center justify-center">
                          <input
                            className="mt-6 text-white rounded-lg bg-purple"
                            type="file"
                            accept="image/*" // Accept only image files
                            required
                            onChange={handleImageUpdate}
                          />
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
                                    Nombres:
                                  </label>
                                </div>
                                <div class="w-full mr-4">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
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
                                    Apellidos:
                                  </label>
                                </div>
                                <div class="w-full mr-4">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    defaultValue={description}
                                    onChange={handleDescriptionChange}
                                  ></input>
                                </div>
                              </div>

                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Fecha de Nacimiento:
                                  </label>
                                </div>
                                <div class="w-full mr-4">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="date"
                                    defaultValue={formatDateForInput(artist)}
                                    onChange={handleArtistChange}
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
                          <form class="w-full">
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
                                    defaultValue={name + " " + description}
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
                                    Fecha de Nacimiento:
                                  </label>
                                </div>
                                <div class="w-full ">
                                  <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    type="text"
                                    defaultValue={formatDate(artist)}
                                    readOnly={true}
                                  ></input>
                                </div>
                              </div>
                            </div>
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
                        className=" mx-auto rounded-full object-fill h-48 w-48 my-2"
                        src={img}
                        alt=""
                      />
                    </div>

                    <div className="relative p-6 flex-auto text-center">
                      <h1 class="inline-block text-xl md:w-flex text-white py-5">
                        ¿Está seguro de querer eliminar al artista{" "}
                        <span class="inline-block text-xl text-red-500 font-bold">
                          {" "}
                          {name}
                        </span>{" "}
                        junto con todos los datos relacionados a este?
                      </h1>{" "}
                      <div class="md:flex md:items-center mb-6">
                        <div class="">
                          <label
                            class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                            for="inline-full-name"
                          >
                            Confirme su contraseña:
                          </label>
                        </div>
                        <form className="justify-center flex" onSubmit={(e) => DeleteArtist(id_artist, e)}>
                          <div class="w-full flex">
                            <input
                              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              id="inline-full-name"
                              type="password"
                              onChange={handlePasswChange}
                              autoComplete="on"
                            ></input>

                            
                          </div>
                          
                          <div class="flex">
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
                    <form onSubmit={(e) => handleAdd(e)}>
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
                                Nombres:
                              </label>
                            </div>
                            <div class="w-full mr-[250px]">
                              <input
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                required
                                name="nombres"
                                defaultValue={fData.nombres}
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
                                Apellidos:
                              </label>
                            </div>
                            <div class="w-full mr-[250px]">
                              <input
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                name="apellidos"
                                
                                defaultValue={fData.apellidos}
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
                                Fecha de Nacimiento:
                              </label>
                            </div>
                            <div class="w-full mr-[250px]">
                              <input
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="date"
                                name="fecha_nac"
                                defaultValue={fData.fecha_nac}
                                onChange={handleInputChange}
                              ></input>
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
        </div>
      </div>
    </>
  );
}
