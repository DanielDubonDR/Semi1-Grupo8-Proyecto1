import React from "react";
import PuestosA from "./puestos_albumes";
import { getTop5_Albumes } from "../routes/routes";
import { useEffect, useState } from "react";

export default function Top5_Albumes() {
  const [albumes, setAlbumes] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await getTop5_Albumes();
        if (res.status === 200) {
            setAlbumes(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="TOP5_Canciones h-full w-full bg-black">
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
