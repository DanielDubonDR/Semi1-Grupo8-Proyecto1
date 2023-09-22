import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Service from '../../Service/Service';
import { useUserContext } from '../../context/UserContext';
import './Login.css';

function Login() {

  const {logueado, setLogueado} = useUserContext();

  const [email_user, setEmail_user] = useState('');
  const [pass_user, setPass_user] = useState('');

  useEffect(() => {
    console.log(logueado)
    if(logueado){
      navigate('/user/home');
    }
  }, [logueado])

  const style_font = {
    fontFamily: "'Quicksand', sans-serif",
  };

  const navigate = useNavigate();

  const handleSubmit = (e) =>{
		e.preventDefault();
	}

  const onChangeEmail = (e) =>{
    setEmail_user(e.target.value);
  }

  const onChangePass = (e) =>{
    setPass_user(e.target.value);
  }

  const handleLogin = () => {
    const data = {
      correo: email_user,
      password: pass_user
    }
    try{
      Service.login(data)
      .then(response => {
        console.log(response.data)
        if(!response.data.status){
          toast.error('Ocurrió un Error!,No se pudo iniciar sesión', {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }
        const data_a_guardar = {
          id: response.data.datosUusario.id_usuario,
          rol: response.data.datosUusario.rol
        }
        sessionStorage.setItem('data_user', JSON.stringify(data_a_guardar));
        setLogueado(true);
        navigate('/user/home');
      })
      
    }catch(error){
      console.log(error);
    }
  }
    return (
        <div className="min-h-screen bg-lightPurple text-white flex justify-center fuente" >
      <div className="max-w-screen-xl m-0 sm:m-10 bg-black shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <form className="bg-black" onSubmit={handleSubmit}>
          <div>
            <img src="http://imgfz.com/i/6mHNsRq.png"
              className="w-52 mx-auto" alt="Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center" >
            <h1 className="text-2xl xl:text-3xl font-bold" style={style_font}>
              Inicia Sesión
            </h1>
            <div className="w-full flex-1 mt-8">
            
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium text-black bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email" placeholder="Email" style={style_font} id="email_user" name="email_user"
                  onChange={onChangeEmail}
                  value={email_user}/>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium text-black bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password" placeholder="Password" style={style_font} id="pass_user" name="pass_user"
                  onChange={onChangePass}
                  value={pass_user}/>
                <button
                  className="mt-5 tracking-wide font-semibold bg-purple text-gray-100 w-full py-4 rounded-lg hover:bg-purple transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  type="button" onClick={handleLogin} >
                  <span className="ml-3" style={style_font}>
                    Iniciar Sesión
                  </span>
                </button>
                <p className="mt-6 text-xs text-white text-center"style={style_font}>
                  ¿Acaso no tienes cuenta? , 
                  <Link to="/registro" className="border-b border-lightPurple border-dotted text-lightPurple"style={style_font} >
                    Registrate Aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>
          </form>
        </div>
        <div className="flex-1 bg-strongPurple text-center hidden lg:flex">
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{ 
                        backgroundImage: "url('http://imgfz.com/i/kK3Miud.jpeg')", 
                        backgroundSize: "cover", 
                        backgroundPosition: "center center" }}>
                </div>
            </div>
        </div>

      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
    );
}

export default Login;