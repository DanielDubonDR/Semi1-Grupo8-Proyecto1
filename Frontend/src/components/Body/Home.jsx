import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Service from "../../Service/Service";
import { useUserContext } from '../../context/UserContext';
import { albumes } from "../datos_test/albumes";
import { profiles } from "../datos_test/artistas";
import { canciones } from "../datos_test/canciones";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import SongCard from "./SongCard";

function Home(){
    const isPlaying = false;
    const {logueado, setLogueado} = useUserContext();
    const [text_welcome, setText_welcome] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if(!logueado){
            navigate('/login');
        }
        const user_data = JSON.parse(sessionStorage.getItem('data_user'));
        Service.getDataUser(user_data.id)
        .then(response => {
            const hora = new Date().getHours();

            if (hora >= 5 && hora < 12) {
                setText_welcome(`Buenos días ${response.data.nombres}!`);
            } else if (hora >= 12 && hora < 18) {
                setText_welcome(`Buenas tardes ${response.data.nombres}!`);
            } else {
                setText_welcome(`Buenas noches ${response.data.nombres}!`);
            }
        })
    }, [logueado])

    

    const activeSong = {};
    return(
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide bg-gradient-to-b from-purple to-black">
        <div className="flex flex-col ml-8 mb-32">
            <div className="w-full flex flex-wrap justify-between items-center sm:flex-row flex-col mt-4">
                <h1 className="font-bold text-4xl text-white text-left">{text_welcome}</h1>
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Canciones</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {canciones.map((song, i) => (
                    <SongCard 
                        key={i}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        i={i}
                    />
                ))}
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Álbumes</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {albumes.map((song, i) => (
                    <AlbumCard 
                        key={i}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        i={i}
                    />
                ))}
            </div>
            <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white text-left">Artistas</h2>
            </div>
            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {profiles.map((artist, i) => (
                    <ArtistCard 
                        key={i}
                        artist={artist}
                        i={i}
                    />
                ))}
            </div>
        </div>
        </div>
    )
}

export default Home;