const Tesseract = require('tesseract.js');

/**
 * Extrae texto de una imagen utilizando OCR
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @returns {Promise<string>} - Texto extraído
 */
const extractTextFromImage = async (imageBuffer) => {
  try {
    // Configuración de Tesseract
    const config = {
      lang: 'spa+eng', // Español e inglés
      oem: 1, // Modo de motor OCR
      psm: 3 // Modo de segmentación de página (3 = auto)
    };
    
    console.log('Iniciando extracción de texto...');
    
    const result = await Tesseract.recognize(imageBuffer, config);
    
    console.log('Extracción de texto completada');
    
    return result.data.text;
    
  } catch (error) {
    console.error('Error en la extracción de texto:', error);
    throw new Error('Error en la extracción de texto de la imagen');
  }
};

module.exports = {
  extractTextFromImage
};
