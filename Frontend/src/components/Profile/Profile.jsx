import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Service from "../../Service/Service";
import { useUserContext } from "../../context/UserContext";
import "./Profile.css";
function Profile(){
    const style_font = {
        fontFamily: "'Quicksand', sans-serif",
    };

    const handlerEdit = () => {
      navigate('/user/edit_profile');
    }
    const {logueado, setLogueado} = useUserContext();
    const navigate = useNavigate();
    const [image_user, setImage_user] = useState('');
    const [name_user, setName_user] = useState('');
    const [apellido_user, setApellido_user] = useState('');
    const [correo_user, setCorreo_user] = useState('');

    useEffect(() => {
      if(!logueado){
          navigate('/login');
      }
      const user_data = JSON.parse(sessionStorage.getItem('data_user'));
      console.log(user_data.id)
      Service.getDataUser(user_data.id)
      .then(response => {
          console.log(response)
          setImage_user(response.data.path_foto)
          setName_user(response.data.nombres)
          setApellido_user(response.data.apellidos)
          setCorreo_user(response.data.correo)
          console.log(image_user)
          console.log(name_user)
      })
    }, [logueado])

    return(
        <div className="flex flex-col flex-grow items-center justify-center p-12 h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black" style={style_font}>
    <h1 className="text-4xl font-bold text-white my-4 mx-auto">Mi Perfil</h1>
            <img className="rounded-full w-40 h-40 mx-auto block border-8 border-lightPurple" 
                    src={image_user} 
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
        <h2 className="text-white text-2xl">{name_user}</h2>
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Apellidos
        </label>
        <h2 className="text-white text-2xl">{apellido_user}</h2>
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="mb-3 block text-base font-medium text-lightPurple"
        >
          Correo Electrónico
        </label>
        <h2 className="text-white text-2xl">{correo_user}</h2>
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