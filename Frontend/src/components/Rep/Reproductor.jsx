import React, { useEffect, useRef, useState } from "react";
import { canciones } from "../datos_test/canciones";
import Barra from "./Barra";
import "./Reproductor.css";
import Vol from "./Volumen";
import Service from "../../Service/Service";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { usePlayer } from "../../context_Player/playerContext";

function Reproductor() {
  const {
    cancionActual,
    setCancionActual,
    canc,
    setCanc,
    reproduciendose,
    setReproduciendose,
  } = usePlayer();

  const usuario = JSON.parse(sessionStorage.getItem("data_user"));
  const audioElem = useRef();

  useEffect(() => {
    if (reproduciendose) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
  }, [cancionActual, reproduciendose]);

  const { logueado, setLogueado } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!logueado) {
      navigate("/login");
    }
  }, [logueado]);

  const onPlaying = () => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    setCancionActual({
      ...cancionActual,
      progress: (ct / duration) * 100,
      length: duration,
    });

    if (ct == duration && canc.length > 1) {
      adelante();
    }
  };

  const fetchData = async () => {
    try {
      console.log(cancionActual);
      let values = {
        id_cancion: cancionActual.id_cancion,
        id_album: cancionActual.id_album,
        id_usuario: usuario.id,
      };
      let res = await Service.postReproduccion(values);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData2 = async (test) => {
    try {
      let values = {
        id_cancion: test.id_cancion,
        id_album: test.id_album,
        id_usuario: usuario.id,
      };
      let res = await Service.postReproduccion(values);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const pausar = () => {
    if (!reproduciendose) {
      fetchData();
    }

    setReproduciendose(!reproduciendose);
  };

  const atras = async () => {
    try {
      let index = canc.findIndex(
        (c) => c.id_cancion === cancionActual.id_cancion
      );
      let back;
      if (index == 0) {
        back = canc[0];
      } else {
        back = canc[index - 1];
      }

      setCancionActual(back);

      let values = {
        id_cancion: back.id_cancion,
        id_album: back.id_album,
        id_usuario: usuario.id,
      };
      let res = await Service.postReproduccion(values);
      setReproduciendose(true);
      audioElem.current.currentTime = 0;
    } catch (error) {
      console.error("Error fetching data adelante:", error);
    }
  };

  const adelante = async () => {
    try {
      let index = canc.findIndex(
        (c) => c.id_cancion === cancionActual.id_cancion
      );
      let siguiente;
      if (index == canc.length - 1) {
        siguiente = canc[0];
      } else {
        siguiente = canc[index + 1];
      }

      setCancionActual(siguiente);

      let values = {
        id_cancion: siguiente.id_cancion,
        id_album: siguiente.id_album,
        id_usuario: usuario.id,
      };
      let res = await Service.postReproduccion(values);
      setReproduciendose(true);
      audioElem.current.currentTime = 0;
    } catch (error) {
      console.error("Error fetching data adelante:", error);
    }
  };

  return (
    <div className="fixed bottom-0 bg-black text-white p-2 z-50 w-screen grid grid-cols-4 gap-2 flex-auto">
      <div className="relative md:flex md:items-center">
        <img className="h-20 w-20" src={cancionActual.path_imagen} alt="" />
        <div>
          <p className="flex justify-between text-white mx-2">
            {cancionActual.nombre}
          </p>
          <p className="flex justify-between text-white/75 mx-2">
            {cancionActual.nombre_artista}
          </p>
        </div>
      </div>

      <div className="md:items-center ">
        <div className="flex justify-between items-center space-x-2 hover:text-white">
          <button
            className="flex justify-between items-center space-x-2 hover:text-white"
            onClick={atras}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
              />
            </svg>
          </button>

          {reproduciendose ? (
            <button
              className="flex justify-between items-center space-x-2 p-2 hover:text-white"
              onClick={pausar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            </button>
          ) : (
            <button
              className="flex justify-between items-center space-x-2 p-2 hover:text-white"
              onClick={pausar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            </button>
          )}

          <button
            className="flex justify-between items-center space-x-2 p-2 hover:text-white"
            onClick={adelante}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
              />
            </svg>
          </button>
        </div>

        <audio
          ref={audioElem}
          onTimeUpdate={onPlaying}
          className="justify-center w-full h-8 bg-purple"
          src={cancionActual.path_cancion}
        ></audio>
        <div className="text-center ">
          <Barra
            audioElem={audioElem}
            reproduciendose={reproduciendose}
            setReproduciendos={setReproduciendose}
            cancionActual={cancionActual}
            setCancionActual={setCancionActual}
            canciones={canciones}
          />
        </div>
      </div>
      <div className="ml-10">
        <Vol
          audioElem={audioElem}
          reproduciendose={reproduciendose}
          setReproduciendos={setReproduciendose}
          cancionActual={cancionActual}
          setCancionActual={setCancionActual}
          canciones={canciones}
        />
      </div>
    </div>
  );
}

export default Reproductor;
