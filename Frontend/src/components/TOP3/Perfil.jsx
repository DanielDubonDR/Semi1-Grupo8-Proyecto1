import React from "react";

export default function Perfil({ profiles }) {
  return <div id="profile">{Item(profiles)}</div>;
}

function Item(data) {
  return (
    <>
      
      <div class="flex h-screen">
      
      <div class="m-auto content-center">
      <div class="w-full max-w-md p-4 bg-gradient-to-b from-silver border border-purple rounded-lg shadow sm:p-8 dark:bg-gradient-to-b from-silver to-95% dark:border-purple shadow-[0_35px_60px_-15px_rgba(152,74,240,0.3)]">
        
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Artista
          </h5>
          <h5 class="text-sm font-bold leading-none text-gray-900 dark:text-white">
            Reproducciones
          </h5>
        </div>
        {data.map((value, index) => (
            <div class="flow-root">
              <ul
                role="list"
                class="divide-y divide-gray-200 dark:divide-gray-700"
              >
                <li class="py-3 sm:py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <img
                        class="w-24 h-24 rounded-full"
                        src={value.img}
                        alt="artista"
                      ></img>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {value.name}
                      </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-purple dark:text-white">
                        {value.reps}   
                    </div>
                  </div>
                </li>
              </ul>
            </div>
        ))}
      </div>
      </div>
      </div>
    </>
  );
}
