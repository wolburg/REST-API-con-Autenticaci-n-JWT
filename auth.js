//En este vamos a verificar que tenga un token valido y que tenga acceso o no

const jwt = require('jwt-simple');
const secret = 'your-secret-key';

const authenticate = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
      console.log(" No Authorization header received");
      return res.status(401).send('No token provided');
  }

  const token = tokenHeader.replace('Bearer ', '');
  console.log("Token recibido:", token);

  try {
      const decoded = jwt.decode(token, secret);
      console.log(" Token decodificado:", decoded);

      if (!decoded.userId) {
          console.log("El token no contiene userId");
          return res.status(401).send('Token inválido: no contiene userId');
      }

      req.user = decoded;
      next(); 
  } catch (error) { 
      console.error(" Error al decodificar token:", error.message);
      return res.status(401).send('Token inválido');  
  }
};

const authorize = (role) => {
    return (req, res, next) => {
        //Vemos que coincida
      if (req.user.role !== role) {  
        //Si no coincide da error
        return res.status(403).send('Acceso denegado'); 
      }
      next();  
    };
  };

  module.exports = {authenticate, authorize};