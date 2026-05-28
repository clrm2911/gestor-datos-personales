const extraerUsuario = (req, res, next) => {
  req.usuario = req.headers['x-user'] || 'desconocido';
  next();
};

module.exports = extraerUsuario;