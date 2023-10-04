import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el idioma español
import React, { useState } from 'react';

const TiempoTranscurrido = ({ fecha }) => {
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const offsetUTC = -6; // UTC-6

// Aplicar el desplazamiento horario
// Formatear la fecha y hora
const formattedDate = new Date(fecha.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
    console.log(formattedDate)
  const fechaFormateada = format(new Date(formattedDate), 'dd/MM/yyyy HH:mm:ss'); // Formatea la fecha

  const tiempoTranscurrido = formatDistanceToNow(new Date(formattedDate), { addSuffix: true, locale: es, includeSeconds: true }); // Configura el idioma y habilita segundos

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
