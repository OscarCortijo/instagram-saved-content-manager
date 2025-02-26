const axios = require('axios');

/**
 * Obtiene un token de acceso de larga duración a partir de un token de corta duración
 * @param {string} shortLivedToken - Token de acceso de corta duración
 * @returns {Promise<Object>} - Token de larga duración y fecha de expiración
 */
const exchangeForLongLivedToken = async (shortLivedToken) => {
  try {
    const response = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: shortLivedToken
      }
    });
    
    const { access_token, expires_in } = response.data;
    
    // Calcular fecha de expiración (expires_in viene en segundos)
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expires_in);
    
    return {
      longLivedToken: access_token,
      expiryDate
    };
    
  } catch (error) {
    console.error('Error al intercambiar por token de larga duración:', error.response?.data || error.message);
    throw new Error('Error al obtener token de larga duración');
  }
};

/**
 * Obtiene información del usuario a partir de un token de acceso
 * @param {string} accessToken - Token de acceso
 * @returns {Promise<Object>} - Información del usuario
 */
const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get('https://graph.instagram.com/me', {
      params: {
        fields: 'id,username',
        access_token: accessToken
      }
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Error al obtener información del usuario:', error.response?.data || error.message);
    throw new Error('Error al obtener información del usuario');
  }
};

/**
 * Obtiene las publicaciones del usuario a partir de un token de acceso
 * @param {string} accessToken - Token de acceso
 * @returns {Promise<Array>} - Lista de publicaciones
 */
const getUserMedia = async (accessToken) => {
  try {
    const response = await axios.get('https://graph.instagram.com/me/media', {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
        access_token: accessToken
      }
    });
    
    return response.data.data;
    
  } catch (error) {
    console.error('Error al obtener media del usuario:', error.response?.data || error.message);
    throw new Error('Error al obtener publicaciones del usuario');
  }
};

/**
 * Simula la obtención de publicaciones guardadas
 * En un entorno real, se necesitaría una solución alternativa ya que la API de Instagram
 * no proporciona acceso directo a las publicaciones guardadas
 * @returns {Promise<Array>} - Lista simulada de publicaciones guardadas
 */
const getSimulatedSavedPosts = async () => {
  // Simulación de datos para demostración
  return [
    {
      id: '123456789',
      mediaType: 'IMAGE',
      mediaUrl: 'https://via.placeholder.com/600x400',
      permalink: 'https://www.instagram.com/p/sample1/',
      timestamp: '2023-01-15T12:00:00Z'
    },
    {
      id: '987654321',
      mediaType: 'VIDEO',
      mediaUrl: 'https://via.placeholder.com/600x400',
      permalink: 'https://www.instagram.com/p/sample2/',
      timestamp: '2023-02-20T15:30:00Z'
    },
    {
      id: '456789123',
      mediaType: 'CAROUSEL_ALBUM',
      mediaUrl: 'https://via.placeholder.com/600x400',
      permalink: 'https://www.instagram.com/p/sample3/',
      timestamp: '2023-03-10T08:45:00Z'
    },
    {
      id: '234567891',
      mediaType: 'IMAGE',
      mediaUrl: 'https://via.placeholder.com/600x400',
      permalink: 'https://www.instagram.com/p/sample4/',
      timestamp: '2023-04-05T09:30:00Z'
    },
    {
      id: '345678912',
      mediaType: 'VIDEO',
      mediaUrl: 'https://via.placeholder.com/600x400',
      permalink: 'https://www.instagram.com/p/sample5/',
      timestamp: '2023-05-18T14:20:00Z'
    },
    {
      id: '567891234',
      mediaType: 'IMAGE',
      mediaUrl: 'https://via.placeholder.com/600x400',
      permalink: 'https://www.instagram.com/p/sample6/',
      timestamp: '2023-06-22T16:45:00Z'
    }
  ];
};

module.exports = {
  exchangeForLongLivedToken,
  getUserInfo,
  getUserMedia,
  getSimulatedSavedPosts
};
