function extraerToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  req.token = authHeader.split(' ')[1];
  next();
}

module.exports = { extraerToken };