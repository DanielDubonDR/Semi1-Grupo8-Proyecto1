import React from 'react';

function Login() {
    
    return (
        <div className="min-h-screen bg-lightPurple text-white flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-black shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src="http://imgfz.com/i/6mHNsRq.png"
              className="w-52 mx-auto" alt="Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-bold font-sans">
              Inicia Sesión
            </h1>
            <div className="w-full flex-1 mt-8">

              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email" placeholder="Email" />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password" placeholder="Password" />
                <button
                  className="mt-5 tracking-wide font-semibold bg-purple text-gray-100 w-full py-4 rounded-lg hover:bg-purple transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span className="ml-3">
                    Iniciar Sesión
                  </span>
                </button>
                <p className="mt-6 text-xs text-white text-center">
                  ¿Acaso no tienes cuenta? , 
                  <a href="#" className="border-b border-lightPurple border-dotted text-lightPurple">
                    Registrate Aqui
                  </a>
                </p>
              </div>
            </div>
          </div>
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
    </div>
    );
}

export default Login;