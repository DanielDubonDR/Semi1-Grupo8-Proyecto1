import React from "react";

function Header_name() {
    return (
        <div>
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
                    {/*En esta parte aparecera la foto del usuario, se uso esta como base para el diseño*/}
                    <img className="rounded-full w-10 h-10" 
                    src="https://img.freepik.com/vector-gratis/astronauta-dabbing-cartoon-vector-icon-illustration-concepto-icono-tecnologia-ciencia-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3360.jpg" 
                    alt="" 
                    />
                    <h2>user</h2>
                    <LogoutIcon className="h-5 w-5"/>
                </div>
            </header>
        </div>
    )
}

export default Header_name;