import React, { useEffect, useState } from "react";
import Puestos from "./puestos_canciones";
import Service from "../../Service/Service";
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../../context/UserContext';

export default function Top5_Canciones() {
    const [canciones, setCanciones] = useState();
    const usuario = JSON.parse(sessionStorage.getItem('data_user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await Service.getTop5_Canciones(usuario.id_usuario);
                if (res.status === 200) {
                    console.log(res);
                    setCanciones(res.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    };

    fetchData();
    }, []);

    const {logueado, setLogueado} = useUserContext();
    const navigate = useNavigate();
      useEffect(() => {
          if(!logueado){
              navigate('/login');
          }
      }, [logueado])

    return (
        <>
            <div className="TOP5_Canciones h-full w-full" >
                { canciones ? <Puestos canciones={canciones} /> : 
                <>
                <div class="flex h-screen-full w-screen-full bg-black">
                  <div class="m-auto content-center">
                    <h1 class="mb-6 text-3xl font-extrabold dark:text-white md:text-5xl lg:text-6xl">
                      <span class="animate-gradient text-transparent bg-300% bg-clip-text bg-gradient-to-r to-silver via-purple from-lightPurple">
                        TOP 5 CANCIONES
                      </span>
                    </h1>
                  </div>
                </div>
              </>

                }
                
            </div>
        </>
    );
}
