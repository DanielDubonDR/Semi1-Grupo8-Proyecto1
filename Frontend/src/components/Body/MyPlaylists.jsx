import React, { useEffect, useState } from "react";
import Service from "../../Service/Service";
import Header_name from "./Header_name";
import PlaylistCard from "./PlaylistCard";
const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [nombre, setNombre] = useState('');
  useEffect(() => {
    const user_data = JSON.parse(sessionStorage.getItem("data_user"));
    Service.getDataUser(user_data.id)
    .then(response => {
        setNombre(response.data.nombres);
    })
    Service.getPlaylists(user_data.id)
    .then((response) => {
      setPlaylists(response.data);
      
    })
  }, []);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide " >
      <Header_name />
      <div className="relative w-full flex flex-col bg-gradient-to-b from-purple to-black">
        <div className="w-full h-40 bg-gradient-to-1 from-transparent to-black sm:h-48"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="ml-7 mt-20">
            <h1 className="font-bold sm:text-4xl text-2xl text-white">
              Mis Playlists
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8 ml-10">
        {playlists.map((playlist, i) => (
          <PlaylistCard
            key={playlist.id_playlist}
            playlist={playlist}
            name_user={nombre}
            fav={i==0}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPlaylists;
