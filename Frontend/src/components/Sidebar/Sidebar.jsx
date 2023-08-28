import { HeartIcon, HomeIcon, LibraryIcon, MusicNoteIcon, PlusCircleIcon, RssIcon, SearchIcon, UserIcon } from '@heroicons/react/outline';
import React from "react";
import './Slidebar.css';
function Sidebar() {
    return(
        <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm: max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex'>
            <div className='space-y-4'>
                <div className="flex items-center space-x-2">
                    <img className='h-20 w-20 align-middle' src="http://imgfz.com/i/pxcvWfe.png" alt="" />
                    <h3 className='tipo_title'>SoundStream</h3>
                </div>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h5 w-5"/>
                    <p>Inicio</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h5 w-5"/>
                    <p>Buscar</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <UserIcon className="h5 w-5"/>
                    <p>Perfil</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h5 w-5"/>
                    <p>Radio</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
                <p>Histórico</p>
                <button className="flex items-center space-x-2 hover:text-white">
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Canciones más reproducidas</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Artistas más reproducidos</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Álbumes más reproducidos</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Mi historial</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
                <p>Playlist</p>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h5 w-5"/>
                    <p>Tus Playlists</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h5 w-5"/>
                    <p>Favoritos</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h5 w-5"/>
                    <p>Crea tu Playlist</p>
                </button>
                
            </div>
        </div>
    )
}

export default Sidebar;