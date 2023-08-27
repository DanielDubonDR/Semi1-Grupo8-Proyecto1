import React from "react";

export default function Navbar({ fixed }) {
  return (
    <>
      
        <nav class="sticky top-0 bg-gradient-to-r from-lightPurple via-purple to-lightPurple dark:bg-gray-900 z-30 w-full px-2 py-4 shadow-[0_30px_30px_-15px_rgba(0,0,0,0.8)]">
          <div class="grid gap-6 md:grid-cols-3 ">
            <div>
                <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">
                  SoundStream
                </span>
            </div>
            <div class="relative hidden md:block">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span class="sr-only">Search icon</span>
              </div>
              <input
                type="text"
                id="search-navbar"
                class="block w-full p-2 pl-10 text-sm text-silver border border-silver rounded-lg bg-gray-50 focus:ring-purple focus:border-black dark:bg-silver dark:border-gray-600 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Búsqueda"
              ></input>
            </div>
            <div></div>
          </div>
        </nav>
      
    </>
  );
}
