import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el idioma español
import React, { useState } from 'react';

const TiempoTranscurrido = ({ fecha }) => {
  const [mostrarFecha, setMostrarFecha] = useState(false);

  const fechaFormateada = format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss');
  const tiempoTranscurrido = formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es, includeSeconds: true }); // Configura el idioma y habilita segundos

  const textoFormateado = tiempoTranscurrido.replace('en alrededor de', 'hace'); // Cambia el texto

  return (
    <span
      onMouseEnter={() => setMostrarFecha(true)}
      onMouseLeave={() => setMostrarFecha(false)}
    >
      {mostrarFecha ? fechaFormateada : textoFormateado}
    </span>
  );
}

export default TiempoTranscurrido;
