// src/utils/validations.js

export const TIPOS_DOCUMENTO = ['Tarjeta de Identidad', 'Cédula']
export const GENEROS = ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar']
export const TIPOS_OPERACION_LOG = ['CREACION', 'MODIFICACION', 'CONSULTA', 'BORRADO', 'RAG']

export function validarNroDocumento(val) {
  if (!val) return 'El número de documento es obligatorio'
  if (!/^\d+$/.test(val)) return 'Solo se permiten números'
  if (val.length > 10) return 'Máximo 10 caracteres'
  return null
}

export function validarNombre(val, etiqueta = 'El campo') {
  if (!val || val.trim() === '') return null // segundo nombre es opcional
  if (/\d/.test(val)) return `${etiqueta} no puede contener números`
  if (val.length > 30) return `${etiqueta} no puede superar los 30 caracteres`
  return null
}

export function validarPrimerNombre(val) {
  if (!val || val.trim() === '') return 'El primer nombre es obligatorio'
  return validarNombre(val, 'El primer nombre')
}

export function validarApellidos(val) {
  if (!val || val.trim() === '') return 'Los apellidos son obligatorios'
  if (/\d/.test(val)) return 'Los apellidos no pueden contener números'
  if (val.length > 60) return 'Los apellidos no pueden superar los 60 caracteres'
  return null
}

export function validarCorreo(val) {
  if (!val || val.trim() === '') return 'El correo electrónico es obligatorio'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(val)) return 'Formato de correo inválido'
  return null
}

export function validarCelular(val) {
  if (!val) return 'El celular es obligatorio'
  if (!/^\d+$/.test(val)) return 'Solo se permiten números'
  if (val.length !== 10) return 'Debe tener exactamente 10 dígitos'
  return null
}

export function validarFoto(file) {
  if (!file) return null
  const MAX_MB = 2
  if (file.size > MAX_MB * 1024 * 1024) return `La foto no puede superar los ${MAX_MB} MB`
  return null
}

export function validarFormularioPersona(data, esModificacion = false) {
  const errores = {}

  if (!esModificacion) {
    const eNro = validarNroDocumento(data.nro_documento)
    if (eNro) errores.nro_documento = eNro

    if (!data.tipo_documento) errores.tipo_documento = 'Selecciona un tipo de documento'
    if (!data.fecha_nacimiento) errores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria'
    if (!data.genero) errores.genero = 'Selecciona un género'
  }

  const ePrimerNombre = validarPrimerNombre(data.primer_nombre)
  if (ePrimerNombre) errores.primer_nombre = ePrimerNombre

  const eSegundoNombre = validarNombre(data.segundo_nombre, 'El segundo nombre')
  if (eSegundoNombre) errores.segundo_nombre = eSegundoNombre

  const eApellidos = validarApellidos(data.apellidos)
  if (eApellidos) errores.apellidos = eApellidos

  const eCorreo = validarCorreo(data.correo_electronico)
  if (eCorreo) errores.correo_electronico = eCorreo

  const eCelular = validarCelular(data.celular)
  if (eCelular) errores.celular = eCelular

  if (data.foto) {
    const eFoto = validarFoto(data.foto)
    if (eFoto) errores.foto = eFoto
  }

  return errores
}
