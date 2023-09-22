import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Service from "../../Service/Service";
import { useUserContext } from "../../context/UserContext";
import "./Profile_Edit.css";
function Profile_Edit(){

  const {logueado, setLogueado} = useUserContext();
  const [image, setImage] = useState(null);
  const [path_image, setPath_image] = useState('');
  const [nombres, setNombres] = useState('');
  const [namephoto, setNamephoto] = useState('Click para cargar la foto o arrastra la imagen acá');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState(0);
    const style_font = {
        fontFamily: "'Quicksand', sans-serif",
    };

    useEffect(() => {
      if(!logueado){
          navigate('/login');
      }
      const user_data = JSON.parse(sessionStorage.getItem('data_user'));
      setId(user_data.id)
      Service.getDataUser(user_data.id)
      .then(response => {
          console.log(response)
          setPath_image(response.data.path_foto)
          setNombres(response.data.nombres)
          setApellidos(response.data.apellidos)
          setCorreo(response.data.correo)
      })
    }, [logueado])
    const handleSubmit = (e) =>{
      e.preventDefault();
    }

    const onChangeFoto = (e) =>{
      const selectedFile = e.target.files[0];
      console.log(selectedFile)
      setNamephoto(selectedFile.name);
      setImage(selectedFile);
    }

    const handleNombre = (e) =>{
      setNombres(e.target.value);
    }

    const handleApellido = (e) =>{
      setApellidos(e.target.value);
    }

    const handleCorreo = (e) =>{
      setCorreo(e.target.value);
    }
    const navigate = useNavigate();
    const verificarPasswd_changephoto = () => {
      if(image === null){
        toast.error('No agregó ninguna imagen', {
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
      Swal.fire({
        title: 'Confirma tu contraseña',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Aplicar',
        cancelButtonText: 'Cancelar',
        customClass: {
            container: 'dark-background', 
            title: 'custom-title',
        },
        confirmButtonColor: '#984AF0',
        cancelButtonColor: '#F87171',
    }).then((result) => {
        if (result.isConfirmed) {
          const pw = result.value;
          const formData = new FormData();
          formData.append('imagen', image);
          formData.append('password', pw);
          Service.updateImageUser(formData, id)
          .then(response => {
            if(response.status){
              toast.success('Cambios aplicados a tu perfil con éxito!', {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
              navigate('/user/profile')
            }else{
              toast.error('Hubo un error', {
                position: "top-center",
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          toast.error('Hubo un error', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        }
    });
    
    }

    const verificarPasswd_changedata = () => {
      Swal.fire({
        title: 'Confirma tu contraseña',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Aplicar',
        cancelButtonText: 'Cancelar',
        customClass: {
            container: 'dark-background', 
            title: 'custom-title',
        },
        confirmButtonColor: '#984AF0',
        cancelButtonColor: '#F87171',
    }).then((result) => {
        if (result.isConfirmed) {
          const pw = result.value;
            if(nombres === '' || apellidos === '' || correo === ''){
              toast.error('Todos los campos son obligatorios', {
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
            console.log(password)
            const data = {
              nombres: nombres,
              apellidos: apellidos,
              correo: correo,
              password: pw
            }
            Service.updateDataUser(data, id)
            .then(response => {
              console.log(response)
              if(response.data.status){
                  toast.success('Cambios aplicados a tu perfil con éxito!', {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                  });
                  navigate('/user/profile')
                }else{
                  toast.error('Hubo un error', {
                    position: "top-center",
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          toast.error('Hubo un error', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        }
    });
    
    }

    return(
      <div className="flex flex-col flex-grow items-center justify-center mb-20 p-12 h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black" style={style_font}>
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
    <h1 className="text-4xl font-bold text-white my-4 mx-auto">Editar Perfil</h1>
            <img className="rounded-full w-40 h-40 mx-auto block border-8 border-lightPurple" 
                    src={path_image} 
                    alt="" 
                    />
                    <br />
                    <div className="flex items-center justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 h-24 bg-lightPurple dark:bg-gray-700 hover:bg-lightPurple dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-lightPurple border-dashed cursor-pointer">
                        <div className="flex flex-col items-center justify-center h-full">
                          <p className="mt-1 mb-1 text-xs text-gray-500 dark:text-gray-400">{namephoto}</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={onChangeFoto}/>
                      </label>
                    </div>
                    <br />
                    <button
          className="hover:shadow-form rounded-md bg-lightPurple py-3 px-8 text-base font-semibold text-white " type="button" onClick={verificarPasswd_changephoto}
        >
          Cambiar Foto
        </button>
  <div className="mx-auto w-full max-w-[550px]">
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        
        <label
          htmlFor="name"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Nombres
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Nombres"
          className="w-full rounded-md border border-lightPurple bg-black py-3 px-6 text-base font-medium text-white focus:border-lightPurple focus:shadow-md"
          value={nombres}
          onChange={handleNombre}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Apellidos
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Apellidos"
          className="w-full rounded-md border border-lightPurple bg-black py-3 px-6 text-base font-medium text-white focus:border-lightPurple focus:shadow-md"
          value={apellidos}
          onChange={handleApellido}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="example@domain.com"
          className="w-full rounded-md border border-lightPurple bg-black py-3 px-6 text-base font-medium text-white  focus:border-lightPurple focus:shadow-md"
          value={correo}
          onChange={handleCorreo}
        />
      </div>
      <div>
        <button
          className="hover:shadow-form rounded-md bg-lightPurple py-3 px-8 text-base font-semibold text-white " type="button" onClick={verificarPasswd_changedata}
        >
          Guardar
        </button>
        &nbsp;&nbsp;
        <button
          className="hover:shadow-form rounded-md bg-white py-3 px-8 text-base font-semibold text-lightPurple " 
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>
    )
}

export default Profile_Edit;