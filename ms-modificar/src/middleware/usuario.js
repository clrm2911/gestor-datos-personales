const extraerUsuario = (req, res, next) => {
  const usuario = req.headers['x-usuario'];
  if (!usuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  req.usuario = usuario;
  next();
};

module.exports = { extraerUsuario };