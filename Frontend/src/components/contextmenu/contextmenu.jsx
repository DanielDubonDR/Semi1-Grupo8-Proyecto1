import React from 'react';

const ContextMenu = ({ xPos, yPos, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="z-10 absolute bg-black border border-black shadow-lg">
      <ul>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800">Eliminar Cancion de la Playlist</li>
        <li className="p-2 cursor-pointer text-white hover:bg-gray-800" onClick={onClose}>Cerrar</li>
      </ul>
    </div>
  );
}

export default ContextMenu;
