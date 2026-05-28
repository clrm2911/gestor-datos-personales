const extraerUsuario = (req, res, next) => {
  req.usuario = req.headers['x-usuario'] || 'desconocido';
  next();
};

module.exports = { extraerUsuario };
