import React from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./Profile.css";
function Profile(){
    const style_font = {
        fontFamily: "'Quicksand', sans-serif",
    };

    const navigate = useNavigate();

    const handlerEdit = () => {
      navigate('/user/edit_profile');
    }

    return(
        <div className="flex flex-col flex-grow items-center justify-center p-12 h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black" style={style_font}>
    <h1 className="text-4xl font-bold text-white my-4 mx-auto">Mi Perfil</h1>
            <img className="rounded-full w-40 h-40 mx-auto block border-8 border-lightPurple" 
                    src="https://img.freepik.com/vector-gratis/astronauta-dabbing-cartoon-vector-icon-illustration-concepto-icono-tecnologia-ciencia-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3360.jpg" 
                    alt="" 
                    />
  <div className="mx-auto w-full max-w-[550px]">
    <form>
      <div className="mb-5">
        
        <label
          htmlFor="name"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Nombres
        </label>
        <h2 className="text-white text-2xl">name</h2>
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Apellidos
        </label>
        <h2 className="text-white text-2xl">last-name</h2>
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Correo Electrónico
        </label>
        <h2 className="text-white text-2xl">correo@dominio.com</h2>
      </div>
      <div>
        <button
          className="hover:shadow-form rounded-md bg-lightPurple py-3 px-8 text-base font-semibold text-white " type="button" 
          onClick={handlerEdit}
        >
          Editar
        </button>
      </div>
    </form>
  </div>
</div>
    )
}

export default Profile;