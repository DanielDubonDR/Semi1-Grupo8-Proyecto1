import React, { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
    const [cancionActual, setCancionActual] = useState({});
    const [canciones, setCanciones] = useState([]);

    const value = {
        cancionActual,
        setCancionActual,
        canciones,
        setCanciones
    }

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    )
}
export default PlayerProvider;
export const usePlayer = () => useContext(PlayerContext);

