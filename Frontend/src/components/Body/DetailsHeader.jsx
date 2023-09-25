import React from "react";

const DetailsHeader = ({ artistId, artistData, songData }) => {
  return (
    <div className="relative w-full flex flex-col bg-gradient-to-b from-purple to-black">
      <div className="w-full h-40 bg-gradient-to-1 from-transparent to-black sm:h-48">
      </div>
      <div className="absolute inset-0 flex items-center">
        <img
          src={artistData.path_fotografia}
          alt=""
          className="sm:w-28 w-28 sm:h-28 h-28 rounded-full object-cover border-2 shadow-xl shadow-black mt-20 ml-10"
        />

        <div className="ml-7 mt-20">
          <h1 className="font-bold sm:text-4xl text-2xl text-white">
            {artistData.nombres + " " + artistData.apellidos}
          </h1>
          <p className="text-white">
            ARTISTA
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsHeader;
