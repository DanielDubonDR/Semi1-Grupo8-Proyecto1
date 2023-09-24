import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Service from "../../Service/Service";
import Header_name from "./Header_name";
const EditarPlaylist = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [infoImage, setInfoImage] = useState('Arrastra aquí');
    const [previewImage, setPreviewImage] = useState(null);
    const [oldImage, setOldImage] = useState('https://i.pinimg.com/236x/bc/3e/3d/bc3e3de9ca839288c7779965afb5c17c.jpg');
    const [oldName, setOldName] = useState('');
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDragStart = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        const image = URL.createObjectURL(files[0]);
        setInfoImage(files[0].name);
        setPreviewImage(image);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        const image = URL.createObjectURL(files[0]);
        console.log(files);
        setInfoImage(files[0].name);
        setPreviewImage(image);
        setImage(files[0]);
    };

    const handleName = (e) => {
        setName(e.target.value);
        console.log(name)
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
        console.log(description)
    };

    const handleSubmit = (e) =>{
		e.preventDefault();
	}

    const handleCancelar = () => {
        navigate('/user/playlists');
    }

    const handleEditPlaylist = () => {
        if(name === ''){
            toast.error('Debe llenar el campo de nombre', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                });
                return;
        }
        const envio = {
            nombre: name,
            descripcion: description
        }
        Service.editarDataPlaylist(envio, id)
        .then(response => {
            if(!response.data.status){
                toast.error('Hubo un error al editar la paylist', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                    return;
            }
            navigate('/user/playlists');
        })
    }

    const handleEditPhotoPlaylist = () => {
        if(image === null){
            toast.error('Debe subir una imagen', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                });
                return;
        }
        const formData = new FormData();
        formData.append('portada', image);
        Service.editarPortadaPlaylist(formData, id)
        .then(response => {
            if(!response.data.status){
                toast.error('Hubo un error al editar la portada de la paylist', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                    return;
            }
            navigate('/user/playlists');
        })
    }

    const squareRef = useRef();
    return(
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <div className=" mb-24">
            <Header_name />
            <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="dark"
            />
            <div className="relative w-full flex flex-col bg-gradient-to-b from-purple to-black">
                <div className="w-full h-40 bg-gradient-to-1 from-transparent to-black sm:h-48"></div>
                <div className="absolute inset-0 flex items-center">
                    <div className="ml-7 mt-20">
                        <h1 className="font-bold sm:text-4xl text-2xl text-white">
                            {`Editando la Playlist ${oldName}`}
                        </h1>
                    </div>
                </div>
            </div>
            <form className="w-full max-w-lg ml-20 mt-12" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-image">
                            Portada Actual
                        </label>
                        <img src={oldImage} alt="Portada Playlist" class="w-40 h-40" />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-image">
                            Cambiar Portada
                        </label>
                        <input type="file" accept="image/*" className="hidden" id="grid-image" onChange={handleFileUpload} />
                        <label htmlFor="grid-image" className={`cursor-pointer w-40 h-40 bg-lightPurple border-white border-2 block relative ${isDragging ? "opacity-50" : ""}`} onDragOver={handleDragStart} onDragLeave={handleDragEnd} onDrop={handleDrop} ref={squareRef}>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-sm">{infoImage}</span>
                        </label>
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2 mt-3" htmlFor="grid-image">
                            {previewImage && "Vista Previa"}
                        </label>
                        {previewImage && <img src={previewImage} alt="Vista previa de la imagen" className="mt-4" style={{ width: "100px", height: "100px" }} />}
                    </div>
                </div>
                <button className="bg-lightPurple text-white hover:bg-white mb-5 hover:text-lightPurple font-bold py-2 px-4 rounded" onClick={handleEditPhotoPlaylist}>
                    Actualizar Portada de Playlist
                </button>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-first-name" aria-required="true">
                            Nombre
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-lightPurple rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Nombre Playlist" onChange={handleName} value={name}/>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" >
                            Descripción
                        </label>
                        <textarea className="resize-none rounded-md h-20 w-full bg-gray-200 text-gray-700 border border-lightPurple py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-lightPurple" id="grid-password" placeholder="Descripción de tu playlist" onChange={handleDescription} value={description}></textarea>
                    </div>
                </div>
                <button className="bg-lightPurple text-white hover:bg-white hover:text-lightPurple font-bold py-2 px-4 rounded" onClick={handleEditPlaylist}>
                    Actualizar Info de la Playlist
                </button>
                <button className="bg-lightPurple text-white ml-3 hover:bg-white hover:text-lightPurple font-bold py-2 px-4 rounded" onClick={handleCancelar}>
                    Cancelar
                </button>
            </form>
        </div>
        </div>
    )
}

export default EditarPlaylist;