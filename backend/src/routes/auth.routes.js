const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { exchangeForLongLivedToken, getUserInfo } = require('../utils/instagram.utils');

// Ruta para iniciar el proceso de autenticación con Instagram
router.get('/instagram', (req, res) => {
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.json({ authUrl: instagramAuthUrl });
});

// Callback para procesar el código de autorización de Instagram
router.get('/instagram/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Intercambiar código por token de acceso
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, user_id } = tokenResponse.data;
    
    // Intercambiar por token de larga duración
    const { longLivedToken, expiryDate } = await exchangeForLongLivedToken(access_token);
    
    // Obtener información del usuario
    const userInfo = await getUserInfo(longLivedToken);
    
    // Buscar si el usuario ya existe en la base de datos
    let user = await User.findOne({ instagramId: userInfo.id });
    
    if (user) {
      // Actualizar token y fecha de expiración
      user.accessToken = longLivedToken;
      user.tokenExpiry = expiryDate;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Crear nuevo usuario
      user = await User.create({
        instagramId: userInfo.id,
        username: userInfo.username,
        accessToken: longLivedToken,
        tokenExpiry: expiryDate
      });
    }
    
    // Generar JWT para la autenticación en el frontend
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user: { id: user._id, username: user.username },
      access_token: longLivedToken,
      token: jwtToken
    });
    
  } catch (error) {
    console.error('Error en autenticación con Instagram:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error en la autenticación con Instagram' });
  }
});

module.exports = router;
