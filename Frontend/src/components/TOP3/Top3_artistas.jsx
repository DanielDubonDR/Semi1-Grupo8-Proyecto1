import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/Service";
import { useUserContext } from '../../context/UserContext';
import Perfil from "./Perfil2";
import "./style_top3.css";


export default function Top3_artistas() {
  const [profiles, setProfiles] = useState();
  const usuario = JSON.parse(localStorage.getItem('data_user'));
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await Service.getTop3_Artistas(usuario.id);
        if (res.status === 200) {
          setProfiles(res.data);
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
      <div className="TOP3_artistas h-full w-full">
        {profiles ? (
          <Perfil profiles={profiles} />
        ) : (
          <>
            <div class="flex w-full h-screen bg-black">
              <div class="m-auto content-center">
                <h1 class="mb-6 text-3xl font-extrabold dark:text-white md:text-5xl lg:text-6xl">
                  <span class="animate-gradient text-transparent bg-300% bg-clip-text bg-gradient-to-r to-purple via-lightPurple from-black">
                    TOP 3 ARTISTAS
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
