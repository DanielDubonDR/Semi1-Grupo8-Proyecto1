import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../Service/Service";
export default function CRUD_album() {
  const [data, setData] = useState({});
  const usuario = JSON.parse(localStorage.getItem("data_user"));
  const [albumes, setAlbumes] = useState([]);
  const [artistasDisponibles, setArtistasDisponibles] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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

      try {
        let res = await Service.listarArtistas();
        console.log("este es el res de los artistas:", res.data);

        if (res.status === 200) {
          setArtistasDisponibles(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    setResponse("");
  }, [response]);
  return (
    <div
      id="profile"
      class="h-screen w-screen overflow-y-auto bg-gradient-to-t from-darkPurple scrollbar-hide mb-[100px]"
    >
      {Item_CRUD_album(albumes, artistasDisponibles, setResponse, response)}
    </div>
  );
}

function Item_CRUD_album(data, artistasDisponibles, setResponse, response) {
  const usuario = JSON.parse(localStorage.getItem("data_user"));

  const [showModal, setShowModal] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const [addSong, setAddSong] = useState(false);
  const [deleteAlbum, setDeleteAlbum] = useState(false);
  const [addAlbum, setAddAlbum] = useState(false);

  const URL = "http://localhost:3001/cambiarEstexd"; //ESTE SE TIENE QUE CAMBIAR, QUE NO SE ME OLVIDE

  const [album, setAlbum] = useState([]);
  //atributos:
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState(-1);
  const [cancionesAlbum, setCancionesAlbum] = useState([]);
  const [title, setTitle] = useState("");
  const [artistaAlbum, setArtistaAlbum] = useState("");
  const [cancionesSinA, setCancionesSinA] = useState([]); //canciones sin album
  const [cancionAdd, setCancionAdd] = useState(-1); 
  const [passw, setPassw] = useState("");

  useEffect(() => {
    obtDatos();
  }, []);

  const [fData, setFData] = useState({
    nombre: "",
    id_artista: "",
    descripcion: "",
    imagen: ""
  });

  const handleInputChange = async (event) => {
    setFData({
      ...fData,
      [event.target.name]: event.target.value,
    });

    console.log("fData: ", fData);
  };

  const handleSongChange = async (event) => {
    console.log("ESTE ES EL VALOR DE LA CANCION", event.target.value);
    setCancionAdd(event.target.value);
  }

  const handlePasswChange = async (event) => {
    setPassw(event.target.value);
  };

  const handleAddSong = async (event) => {
    event.preventDefault();
    try {
      let enviar = {
        "id_album": parseInt(songs),
        "id_cancion": parseInt(cancionAdd)
      }
      const res = await Service.agregarCancionAlbum(enviar);
      if (res.status == 200) {
        toast.success("La canción ha sido agregada correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setResponse("ok");
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - la canción no ha sido agregada.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setFData({
      nombre: "",
      id_artista: "",
      descripcion: "",
      imagen: ""
    });

    setAddSong(false);
  };


  const handleAdd = async (event) => {
    event.preventDefault();

    fData.imagen = img;
    fData.id_artista = artist;

    setImg("");
    setArtist("");
    
    try {
      const res = await Service.crearAlbum(fData);

      if (res.status == 200) {
        toast.success("El album ha sido creado correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - el album no ha sido creado.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setResponse("Add");
    setFData({
      nombre: "",
      id_artista: "",
      descripcion: "",
      imagen: ""
    });
    setAddAlbum(false);
  };



  const obtDatos = async () => {
    setAlbum(data);
  };
  const getRowValue = (e) => {
    console.log("HOLIWIS KIWIIIIIIIIS", e);
  };

  const obtCancionesAlbum = async (id_album) => {
    try {
      let res = await Service.listarCancionesAlbum(id_album,usuario.id);
      if (res.status === 200) {
        console.log("ESTAS SON LAS CANCIONES DEL ALBUM", res.data);
        setCancionesAlbum(res.data["songsWithLike"]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const obtCancionesSinAlbum = async (id_artista) => {
    try {
      let res = await Service.listarCancionesSinAlbum(id_artista);
      if (res.status === 200) {
        setCancionesSinA(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleNameChange = async (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = async (event) => {
    setDescription(event.target.value);
  };

  const handleArtistChange = async (event) => {
    console.log("ESTE ES EL ARTISTA", event.target.value);
    setArtist(event.target.value);
  };

  const handleEliminarCancion = async (e, event) =>
  { 
    e.preventDefault();
    try {
      const res = await Service.eliminarCancionAlbum({
        id_album: songs,
        id_cancion: parseInt(event) 
      });
      console.log("ESTE ES EL RES", res);
      if (res.status === 200) {
        toast.success("La canción ha sido eliminada correctamente del álbum.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        
        setResponse("Eliminado")
        set

      } else {
        toast.error("Ha ocurrido un error - la canción no ha sido eliminada.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error){
      
      console.log(error);
      toast.error("Ha ocurrido un error - la canción no ha sido eliminada.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

  }

  const handleActualizacion = async (e) => {
    e.preventDefault();
    let datos_Enviar = {
      nombre: name,
      descripcion: description,
      id_artista: artist,
    };

    try {
      const res = await Service.actualizarAlbum(datos_Enviar, songs);
      console.log("ESTE ES EL RES", res);
      if (res.status == 200) {
        toast.success("El album ha sido actualizado correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setResponse("Actualizado")
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - el album no ha sido actualizado.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setShowModal(false);
    setShowSongs(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setImg(file);
    }
  };

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await Service.actualizarAlbumImagen(formData, songs);
      if (res.status == 200) {
        toast.success("La imagen ha sido actualizada correctamente.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setResponse("Update")
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - la imagen no ha sido actualizada.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleEliminacion = async (e, songs) => {
    e.preventDefault();
    try {
      let enviar = {
        idAlbum: songs,
        idUser: usuario.id,
        password: passw, 
      };

      console.log("ESTE ES EL ENVIO", enviar);
      const res = await Service.eliminarAlbum(enviar);
      
      if (res.status == 200) {
        toast.success("El album ha sido eliminado correctamente.", {
          position: toast.POSITION.TOP_RIGHT,

        });
        setResponse("Delete")
        setDeleteAlbum(false);
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error - el album no ha sido eliminado.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const openModal = async (op, name, artist, img, description, songs) => {
    setName("");
    setArtist("");
    setImg("");
    setDescription("");
    setSongs(-1);
    setCancionesAlbum([]);


    try {
      if (op === 1 || op === 2 || op === 3 || op === 4) {
        let res = await Service.getArtista(artist);
        if (res.status == 200) {
          setArtistaAlbum(res.data);
          console.log("ESTE ES EL ARTISTA", res.data);
          await obtCancionesSinAlbum(res.data.id_artista);
        } else {
          console.log("Error al obtener el artista");
        }
      }


      if (op === 1) {
        //actualizar
        setTitle("Actualizar Album");
        setName(name);
        setArtist(artist);

        console.log("ESTE ES EL ARTISTA DEL ALBUM", artistaAlbum);
        setImg(img);
        setDescription(description);
        setSongs(songs);

        setShowModal(true);
      } else if (op === 2) {
        // agregar cancion al álbum
        setAddSong(true);
        setTitle("Administración de canciones");
        setName(name);
        setArtist(artist);
        setImg(img);
        setDescription(description);
        setSongs(songs);


        await obtCancionesAlbum(songs);
      } else if (op === 3) {
        //detalle
        setShowModal(true);
        setShowSongs(true);
        setTitle("Detalle");
        setName(name);
        setArtist(artist);
        setImg(img);
        setDescription(description);
        obtCancionesAlbum(songs);
        setSongs(songs);
      } else if (op === 4) {
        //eliminar
        setDeleteAlbum(true);
        setTitle("Eliminar Album");
        setName(name);
        setArtist(artist);
        setImg(img);
        setDescription(description);
        obtCancionesAlbum(songs);
        setSongs(songs);
      } else {
        //agregar
        setAddAlbum(true);
        setTitle("Agregar Album");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div class="flex h-screen">
        <div class="m-auto content-center">
          <section className="flex items-end h-50 text-white p-8 ">
            <div class="md:flex md:items-center place-content-between ltr:ml-3 rtl:mr-3">
              <h1 className="md:w-flex text-2xl xl:text-5xl font-bold ">
                Gestión de Álbumes
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
                        viewbox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                      </svg>
                      Agregar Album
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
                    Actualizar
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Agregar Cancion
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
                        class="w-24 h-24 rounded-r-lg"
                        src={value.path_imagen}
                        alt="artista"
                      ></img>
                    </th>

                    <td class="px-6 py-4">{value.nombre}</td>
                    <td class=" text-center">
                      <button
                        class="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded "
                        onClick={() =>
                          openModal(
                            1,
                            value.nombre,
                            value.id_artista,
                            value.path_imagen,
                            value.descripcion,
                            value.id_album
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

                    <td class="px-6 py-4 text-center">
                      <button
                        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded "
                        onClick={() =>
                          openModal(
                            2,
                            value.nombre,
                            value.id_artista,
                            value.path_imagen,
                            value.descripcion,
                            value.id_album
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
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
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
                            value.descripcion,
                            value.id_album
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
                            value.descripcion,
                            value.id_album
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
                            required
                            onChange={handleImageUpdate}
                          />
                        </div>
                      ) : null}
                    </div>

                    {!showSongs ? (
                      <div className="relative p-6 flex-auto">
                        <div class="w-full ">
                          <form
                            class="w-full "
                            onSubmit={(e) => handleActualizacion(e)}
                          >
                            <div class="md:flex md:items-center mb-6">
                              <div class="">
                                <label
                                  class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                  for="inline-full-name"
                                >
                                  Título
                                </label>
                              </div>
                              <div class="w-full mr-[250px]">
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
                                  Artista
                                </label>
                              </div>
                              <div class="w-full mr-[250px]">
                                <select
                                  class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                  onChange={handleArtistChange}
                                  value={artist}
                                >
                                  {artistasDisponibles.map((value, index) => (
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
                              Descripción
                            </label>
                            <div class="md:flex md:items-center mb-6">
                              <div class=""></div>
                              <div class="w-full ">
                                <textarea
                                  class="bg-gray-200 appearance-none h-20 overflow-y-auto border-2 border-gray-200 rounded w-full py- px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                  id="inline-full-name"
                                  type="text"
                                  defaultValue={description}
                                  onChange={handleDescriptionChange}
                                ></textarea>
                              </div>
                            </div>

                            <div class="md:flex md:items-center">
                              <div class="md:w-1/3"></div>
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
                          <form class="w-full grid grid-cols-2 grid-rows-3 gap-4">
                            <div class="row-span-3">
                              <div class="md:flex md:items-center mb-6">
                                <div class="">
                                  <label
                                    class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
                                    for="inline-full-name"
                                  >
                                    Título
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
                                    defaultValue={
                                      artistaAlbum.nombres +
                                      " " +
                                      artistaAlbum.apellidos
                                    }
                                    readOnly={true}
                                  ></input>
                                </div>
                              </div>
                              <div class="">
                                <label
                                  class="block text-white font-bold md:text-left mb-1 md:mb-2 pr-4"
                                  for="inline-full-name"
                                >
                                  Descripción
                                </label>
                                <div class="md:flex md:items-center mb-6">
                                  <div class=""></div>
                                  <div class="w-full ">
                                    <textarea
                                      class="bg-gray-200 appearance-none h-40 overflow-y-auto border-2 border-gray-200 rounded w-full py- px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                      id="inline-full-name"
                                      type="text"
                                      defaultValue={description}
                                      readOnly={true}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="row-span-3 ">
                              <h1 class="text-white mb-2 pr-4 text-lg font-bold ">
                                Canciones:
                              </h1>
                              <div class="overflow-y-auto scrollbar-hide overflow-x-auto h-72">
                                <table class="table-auto border-collapse border-2 border-black bg-black2 overflow-y-auto overflow-x-auto h-32 w-full">
                                  <thead>
                                    <tr class="bg-purple">
                                      <th class="text-black" colspan="3">
                                        En este album:
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cancionesAlbum.map((value, index) => (
                                      <tr class="hover:bg-darkPurple/50 border-b border-black ">
                                        <td class="border-r text-center text-align-center text-gray-300">
                                          {" "}
                                          {index + 1}
                                        </td>
                                        <td class="text-gray-300 text-center">
                                          {" "}
                                          {" " + value.nombre}
                                        </td>
                                        <td class="text-gray-300 text-center">
                                          <audio
                                            controls
                                            src={value.path_cancion}
                                          ></audio>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
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

          {/*Modal de agregar cancion */}
          {addSong ? (
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
                          setAddSong(false);
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

                    <div className="relative px-6 text-center">
                      <h1 class="font-bold inline-block text-xl md:w-flex text-white/75">
                        Album:{" "}
                        <span class="inline-block text-xl text-white font-bold">
                          {name}
                        </span>
                      </h1>

                      <h1 class="font-bold inline-block text-xl md:w-flex text-white/75 ">
                        Artista:{" "}
                        <span class="inline-block text-xl text-white font-bold">
                          {artistaAlbum.nombres + " " + artistaAlbum.apellidos}
                        </span>
                      </h1>
                      <form onSubmit={(e)=>handleAddSong(e)}>
                      <div class="md:flex md:items-center mb-6">
                        
                        <label
                          for="songs"
                          class="bloc text-lg font-medium dark:text-white"
                        >
                          Selección:
                        </label>
                        
                        <select
                          id="songs"
                          class="ml-4 bg-black3 border border-purple text-white text-sm rounded-lg focus:ring-puple focus:border-purple block w-full p-2.5"
                          onChange={handleSongChange}
                        >
                          <option selected>Canciones disponibles</option>
                          {cancionesSinA.map((value, index) => (
                            <option key={value.id_cancion} value={value.id_cancion}>
                              {value.nombre}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          for="songs"
                          
                          class="ml-4 text-white bg-green-500 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Añadir
                        </button>
                        
                      </div>
                      </form >
                      <div class="grid grid-cols-1">
                        <div class="overflow-y-auto scrollbar-hide overflow-x-auto h-52 max-h-50">
                        <form >
                          <table class="table-auto border-collapse border-4 border-black bg-black2 overflow-y-auto overflow-x-auto  w-full">
                            <thead class="sticky top-0">
                              <tr class="bg-purple ">
                                <th class="text-black" colspan="2">
                                  CANCIONES:
                                </th>
                                <th scope="col" class="px-2">
                                  Eliminar
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              
                              {cancionesAlbum.map((value, index) => (
                                <tr class="hover:bg-darkPurple/50 border-b border-black ">
                                  <td class="border-r text-center text-align-center text-gray-300">
                                    {" "}
                                    {index + 1}
                                  </td>
                                  <td class="text-gray-300 text-center">
                                    {" "}
                                    {" " + value.nombre}
                                  </td>
                                  <td class="text-gray-300 text-center">
                                    <button class="bg-red-500 px-8 rounded-lg mt-1 my-1/2  hover:bg-red-900" type="submit" onClick={(e)=>handleEliminarCancion(e, value.id_cancion)}>
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
                                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              
                            </tbody>
                          </table>
                          </form>
                        </div>
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-1 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          {
                            setAddSong(false);
                          }
                        }}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        class="text-white bg-gradient-to-br from-purple to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                        onClick={() => {
                          {
                            setAddSong(false);
                          }
                        }}
                      >
                        Guardar
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
                        ¿Está seguro de querer eliminar el álbum{" "}
                        <span class="inline-block text-xl text-red-500 font-bold">
                          {" "}
                          {name}
                        </span>
                        ?
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
                        <form
                          className="justify-center flex"
                          onSubmit={(e) => handleEliminacion(e, songs)}
                        >
                          <div class="w-full flex">
                            <input
                              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              id="inline-full-name"
                              type="password"
                              autoComplete="on"
                              onChange={handlePasswChange}
                            ></input>
                          </div>
                          <button
                            type="submit"
                            className="text-white flex ml-4 bg-gradient-to-br from-red-900 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                          >
                            Eliminar
                          </button>
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
                                {artistasDisponibles.map((value, index) => (
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
                            Descripción
                          </label>
                          <div class="md:flex md:items-center mb-6">
                            <div class=""></div>
                            <div class="w-full ">
                              <textarea
                                class="bg-gray-200 appearance-none h-20 overflow-y-auto border-2 border-gray-200 rounded w-full py- px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                name="descripcion"
                                defaultValue={fData.descripcion}
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
        </div>
      </div>
    </>
  );
}
