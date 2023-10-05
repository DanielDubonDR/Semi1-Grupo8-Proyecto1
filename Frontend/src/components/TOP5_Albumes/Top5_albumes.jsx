import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/Service";
import { useUserContext } from '../../context/UserContext';
import PuestosA from "./puestos_albumes";

export default function Top5_Albumes() {
  const [albumes, setAlbumes] = useState();
  const usuario = JSON.parse(localStorage.getItem('data_user'));
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await Service.getTop5_Albumes(usuario.id);
        if (res.status === 200) {
            setAlbumes(res.data);
            console.log(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      <div className="TOP5_Canciones h-full w-full bg-black  mb-[150px]">
        {albumes ? (
          <PuestosA albumes={albumes} />
        ) : (
          <>
            <div class="flex h-full w-full bg-black">
              <div class="m-auto content-center">
                <h1 class="mb-6 text-3xl font-extrabold dark:text-white md:text-5xl lg:text-6xl">
                  <span class="animate-gradient text-transparent bg-300% bg-clip-text bg-gradient-to-r to-black2 via-white from-purple">
                    TOP 5 ALBUMES
                  </span>
                </h1>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
