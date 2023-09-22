import React from "react";
import { useNavigate } from "react-router-dom";
const ArtistCard = ({ artist, i }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/user/artista/${i}`)
    }

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white bg-opacity-20 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer" onClick={handleClick}>
      <div className="relative w-full h-56 group rounded-full overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src={artist?.img}
          alt="song_img"
        />
      </div>
      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          {artist?.name}
        </p>
        <p>
            Artista
        </p>
      </div>
    </div>
  );
};

export default ArtistCard;
