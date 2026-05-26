function esFechaValida(fecha) {
  const d = new Date(fecha);
  return !isNaN(d.getTime());
}

function validarPersona(data) {
  const errores = [];

  const tiposValidos = ['Tarjeta de Identidad', 'Cédula'];
  if (!tiposValidos.includes(data.tipo_documento)) {
    errores.push('tipo_documento debe ser Tarjeta de Identidad o Cédula');
  }

  if (!data.nro_documento || !/^\d{1,10}$/.test(data.nro_documento)) {
    errores.push('nro_documento debe ser numérico y máximo 10 caracteres');
  }

  if (!data.primer_nombre || /\d/.test(data.primer_nombre) || data.primer_nombre.length > 30) {
    errores.push('primer_nombre no debe contener números y máximo 30 caracteres');
  }

  if (data.segundo_nombre && (/\d/.test(data.segundo_nombre) || data.segundo_nombre.length > 30)) {
    errores.push('segundo_nombre no debe contener números y máximo 30 caracteres');
  }

  if (!data.apellidos || /\d/.test(data.apellidos) || data.apellidos.length > 60) {
    errores.push('apellidos no debe contener números y máximo 60 caracteres');
  }

  if (!data.fecha_nacimiento || !esFechaValida(data.fecha_nacimiento)) {
    errores.push('fecha_nacimiento debe ser una fecha válida (YYYY-MM-DD)');
  }

  const generosValidos = ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar'];
  if (!generosValidos.includes(data.genero)) {
    errores.push('genero debe ser Masculino, Femenino, No binario o Prefiero no reportar');
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.correo_electronico || !regexEmail.test(data.correo_electronico)) {
    errores.push('correo_electronico debe tener formato válido');
  }

  if (!data.celular || !/^\d{10}$/.test(data.celular)) {
    errores.push('celular debe ser numérico y exactamente 10 caracteres');
  }

  return errores;
}

module.exports = { validarPersona };