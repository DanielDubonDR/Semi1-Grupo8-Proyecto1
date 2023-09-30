import React, { useEffect, useState } from "react";
import Service from "../../Service/Service";
import Header_name from "./Header_name";
import HistorySongs from "./HistorySongs";
const Historial = () => {
  const [name_user, setName_user] = useState("");
  const [apellido_user, setApellido_user] = useState("");
  const [registro, setRegistro] = useState([]);
  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("data_user"));
    Service.getDataUser(user_data.id).then((response) => {
      console.log(response);
      setApellido_user(response.data.apellidos);
      setName_user(response.data.nombres);
      console.log(image_user);
      console.log(name_user);
    });

    Service.getHistorial(user_data.id).then((response) => {
      console.log(response.data);
      setRegistro(response.data);
    });
  }, []);
  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
      <Header_name />
      <div className="relative w-full flex flex-col bg-gradient-to-b from-purple to-black">
        <div className="w-full h-40 bg-gradient-to-1 from-transparent to-black sm:h-48"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="ml-7 mt-20">
            <h1 className="font-bold sm:text-4xl text-2xl text-white">
              Mi Historial
            </h1>
          </div>
        </div>
      </div>

        <div>
            <HistorySongs
            canciones={registro}/>
        </div>
    </div>
  );
};

export default Historial;
