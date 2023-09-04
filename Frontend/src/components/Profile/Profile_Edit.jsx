import React from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import "./Profile_Edit.css";
function Profile_Edit(){
    const style_font = {
        fontFamily: "'Quicksand', sans-serif",
    };

    const verificarPasswd_changephoto = () => {
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
        <div className="flex flex-col flex-grow items-center justify-center p-12 h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black" style={style_font}>
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
                    src="https://img.freepik.com/vector-gratis/astronauta-dabbing-cartoon-vector-icon-illustration-concepto-icono-tecnologia-ciencia-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3360.jpg" 
                    alt="" 
                    />
                    <br />
                    <div className="flex items-center justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 h-24 bg-lightPurple dark:bg-gray-700 hover:bg-lightPurple dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-lightPurple border-dashed cursor-pointer">
                        <div className="flex flex-col items-center justify-center h-full">
                          <p className="mt-1 mb-1 text-xs text-gray-500 dark:text-gray-400">Click para cargar la foto o arrastra la imagen acá</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                    <br />
                    <button
          className="hover:shadow-form rounded-md bg-lightPurple py-3 px-8 text-base font-semibold text-white " type="button" onClick={verificarPasswd_changephoto}
        >
          Cambiar Foto
        </button>
  <div className="mx-auto w-full max-w-[550px]">
    <form>
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