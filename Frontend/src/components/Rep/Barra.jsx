import React, { useEffect, useRef, useState } from "react";
import "./Reproductor.css";

const Barra = ({
  audioElem,
  reproduciendose,
  setReproduciendos,
  cancionActual,
  setCancionActual,
  canciones,
}) => {
  const clickRef = useRef();
    const [tiempoCancion, setTiempoCancion] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioElem.current) {
                setTiempoCancion(audioElem.current.currentTime);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [audioElem.current]);


  const largo = (e) => {
    let l = clickRef.current.clientWidth;
    const x = e.nativeEvent.offsetX;

    const dprogress = (x / l) * 100;
    audioElem.current.currentTime = (dprogress * cancionActual.length) / 100;
  };

  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };
  
  return (
    <div className="navigation">
      <div className="navigation_wrapper2" onClick={largo} ref={clickRef}>
        <div
          className="seek_bar"
          style={{ width: `${cancionActual.progress + "%"}` }}
        ></div>{getTime(tiempoCancion)}/{getTime(cancionActual.length)}
        </div>
    </div>
  );

};
export default Barra;
