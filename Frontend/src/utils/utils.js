function convertirFechaParaSQL(fecha) {
    // Obtener los componentes de la fecha
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');

    // Crear la cadena en formato SQL
    const fechaSQL = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return fechaSQL;
}

export default convertirFechaParaSQL;