const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Middleware para verificar token JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del encabezado de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No se proporcionó token de autorización' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // Adjuntar usuario a la solicitud
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
