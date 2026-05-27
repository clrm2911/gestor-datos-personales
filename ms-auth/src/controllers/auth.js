const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/discovery/v2.0/keys`
});

function obtenerClave(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

async function validarToken(req, res) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    obtenerClave,
    {
      audience: process.env.ENTRA_CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/v2.0`,
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const usuario = decoded.preferred_username || decoded.email || decoded.sub;
      res.set('X-Usuario', usuario);
      return res.status(200).json({ usuario });
    }
  );
}

module.exports = { validarToken };