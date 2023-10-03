import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el idioma español
import React, { useState } from 'react';

const TiempoTranscurrido = ({ fecha }) => {
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const offsetUTC = -6; // UTC-6

// Aplicar el desplazamiento horario
const fechaUTCmenos6 = new Date(new Date(fecha).getTime() + (offsetUTC * 60 * 60 * 1000));
    console.log(fechaUTCmenos6)
// Formatear la fecha y hora
const formattedDate = fechaUTCmenos6.toISOString().slice(0, 19).replace('T', ' ');
    console.log(formattedDate)
  const fechaFormateada = format(new Date(fechaUTCmenos6), 'dd/MM/yyyy HH:mm:ss'); // Formatea la fecha

  const tiempoTranscurrido = formatDistanceToNow(new Date(fechaUTCmenos6), { addSuffix: true, locale: es, includeSeconds: true }); // Configura el idioma y habilita segundos

  const textoFormateado = tiempoTranscurrido.replace('en alrededor de', 'hace'); // Cambia el texto

  return (
    <p
      onMouseEnter={() => setMostrarFecha(true)}
      onMouseLeave={() => setMostrarFecha(false)}
    >
      {mostrarFecha ? fechaFormateada : textoFormateado}
    </p>
  );
}

export default TiempoTranscurrido;
