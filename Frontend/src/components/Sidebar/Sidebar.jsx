import { HeartIcon, HomeIcon, MusicNoteIcon, PlusCircleIcon, RssIcon, SearchIcon, UserIcon } from '@heroicons/react/outline';
import React from "react";
import { BiLibrary } from "react-icons/bi";
import { Outlet, useNavigate } from 'react-router-dom';
import Reproductor from '../Rep/Reproductor';
import './Slidebar.css';
function Sidebar() {
    const navigate = useNavigate();
    //const navigate = useNavigate();

    const handlerInicio = () => {
        navigate('/user/home');
    }
    const handlerBuscar = () => {
        navigate('/user/search');
    }
    const handlerPerfil = () => {
        navigate('/user/profile');
    }

    const handlerTop5 = () => {
        navigate('/user/top5_canciones');
    }

    const handlerTop5A = () => {
        navigate('/user/top5_albumes');
    }

    const handlerTop3 = () => {
        navigate('/user/top3_artistas');
    }

    const handlerFavoritos = () => {
        navigate('/user/favoritos');
    }

    const handlerMyPlaylists = () => {
        navigate('/user/playlists');
    }
    const handlerHistorial = () => {
        navigate('/user/historial');
    }
    const handlerCreatePlaylist = () => {
        navigate('/user/playlist/crear');
    }

    return(
        
        <div className='flex'>
        <div className='bg-black text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm: max-w-[12rem] lg:max-w-[16rem] hidden md:inline-flex'>
            
            <div className='space-y-4'>
                <div className="flex items-center justify-center space-x-2">
                    <img className='h-20 w-20 align-middle' src="http://imgfz.com/i/pxcvWfe.png" alt="" />
                </div>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerInicio}>
                    <HomeIcon className="h5 w-5"/>
                    <p>Inicio</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerBuscar}>
                    <SearchIcon className="h5 w-5"/>
                    <p>Buscar</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerPerfil}>
                    <UserIcon className="h5 w-5"/>
                    <p>Perfil</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h5 w-5"/>
                    <p>Radio</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
                <p>Histórico</p>
                <button className="flex items-center space-x-2 hover:text-white " onClick={handlerTop5}>
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Canciones más reproducidas</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerTop3}>
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Artistas más reproducidos</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white"onClick={handlerTop5A}>
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Álbumes más reproducidos</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerHistorial}>
                    <MusicNoteIcon className="h5 w-5"/>
                    <p>Mi historial</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
                <p>Playlist</p>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerMyPlaylists}>
                    <BiLibrary className="h5 w-5"/>
                    <p>Mis Playlists</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerFavoritos}>
                    <HeartIcon className="h5 w-5"/>
                    <p>Favoritos</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white" onClick={handlerCreatePlaylist}>
                    <PlusCircleIcon className="h5 w-5"/>
                    <p>Crea tu Playlist</p>
                    
                </button>
                
            </div>
            
        </div>
        <div className="flex justify-between">
        <Reproductor/>
        </div>
        <Outlet/>
        
        </div>
    )
}

export default Sidebar;