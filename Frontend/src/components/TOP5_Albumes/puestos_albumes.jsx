import React from "react";
export default function PuestosA({ albumes }) {
  return <div id="profile">{Item(albumes)}</div>;
}

function Item(data) {
  return (
    <>
      <div class="flex h-screen">
        <div class="m-auto content-center">
          <h1 class="mb-6 text-3xl font-extrabold dark:text-white md:text-5xl lg:text-6xl">
            <span class="animate-gradient text-transparent bg-300% bg-clip-text bg-gradient-to-r to-black2 via-white from-purple">
              TOP 5 ALBUMES
            </span>
          </h1>
          <table class="table-auto bg-gradient-to-b from-black2 to-white rounded-lg shadow sm:p-8 dark:bg-gradient-to-b from-purple dark:border-purple shadow-[0_35px_60px_-15px_rgba(152,74,240,0.5)] ">
            <thead>
              <tr>
                <th class="align-center py-4">
                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Puesto
                  </h5>
                </th>
                <th class="align-center"></th>
                <th class="align-center">
                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Nombre
                  </h5>
                </th>
                <th class="px-10">
                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Reproducciones
                  </h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((value, index) => (
                <tr>
                  <td class="px-10 text-center">
                    <p class="text-2xl font-medium text-gray-900 truncate dark:text-black">
                      {index + 1}
                    </p>
                  </td>
                  <td class="px-10 py-6">
                    {" "}
                    <img
                      class="w-24 h-24 rounded-r-lg"
                      src={value.img}
                      alt="artista"
                    ></img>
                  </td>
                  <td class="px-10 py-6 text-center">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-black">
                      {value.name}
                    </p>
                  </td>
                  <td class="text-right px-10 py-6 ">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-black">
                      {value.reps}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
