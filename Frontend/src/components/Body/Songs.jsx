import React from "react";
import { canciones_artista } from "../datos_test/canciones_artista";
import Song from "./Song";

//Se creo una lista de canciones para ejemplo
const canciones_ejemplo = [
    {name:'Perdón, Perdón', artist: 'Los Ángeles Azules, Ha*Ash', duration:'3:01', album:'Esto Sí Es Cumbia'}, 
    {name:'Nunca Es Sufucuente', artist: 'Los Ángeles Azules, Natalia Lafourcade', duration: '4:26', album:'Esto Sí Es Cumbia'}, 
    {name:'Me Cuesta Tanto Olvidarte', artist: 'Los Ángeles Azules, Ana Torronja', duration: '2:44', album:'Esto Sí Es Cumbia'}, 
    {name:'El Amor Después del Amor', artist: 'Los Ángeles Azules, Fito Páez', duration: '4:34', album:'Esto Sí Es Cumbia'},
    {name:'Sexo, Pudor y Lágrimas', artist: 'Los Ángeles Azules, Aleks Syntek', duration: '3:59', album:'Esto Sí Es Cumbia'},
    {name:'Antes Que al Mío', artist: 'Los Ángeles Azules, Los Claxons', duration: '3:10', album:'Esto Sí Es Cumbia'},
    {name:'Dr. Psiquiatra', artist: 'Los Ángeles Azules, Gloria Trevi', duration: '3:22', album:'Esto Sí Es Cumbia'},
    {name:'Detras de Mi Ventana', artist: 'Los Ángeles Azules, Yuri', duration: '4:26', album:'Esto Sí Es Cumbia'},
    {name:'Morir de Amor', artist: 'Los Ángeles Azules, Miguel Bosé', duration: '3:24', album:'Esto Sí Es Cumbia'},
    {name:'Ni Contigo, Ni Sin Ti', artist: 'Los Ángeles Azules, Pepe Aguilar', duration: '4:11', album:'Esto Sí Es Cumbia'}
]


function Songs() {
    
    return (
        <div className=" px-8 flex flex-col space-y-1 pb-36 text-white">
            {canciones_artista.map((cancion, i) => (
                <Song key={i} order={i} track={cancion}/>
            ))}
        </div>
    )
}

export default Songs;