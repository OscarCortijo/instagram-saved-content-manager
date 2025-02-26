const { OpenAI } = require('openai');

// Inicializar cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribe audio utilizando el modelo Whisper de OpenAI
 * @param {Buffer} audioBuffer - Buffer del archivo de audio
 * @returns {Promise<string>} - Texto transcrito
 */
const transcribeAudio = async (audioBuffer) => {
  try {
    console.log('Iniciando transcripción de audio...');
    
    // Convertir buffer a File para OpenAI
    const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' });
    
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'es', // Especificar idioma español
      response_format: 'text'
    });
    
    console.log('Transcripción de audio completada');
    
    return transcription.text;
    
  } catch (error) {
    console.error('Error en la transcripción de audio:', error);
    throw new Error('Error al transcribir el audio');
  }
};

/**
 * Analiza texto para extraer categorías y etiquetas sugeridas utilizando la API de OpenAI
 * @param {string} text - Texto a analizar
 * @returns {Promise<Object>} - Categorías y etiquetas sugeridas
 */
const analyzeTextContent = async (text) => {
  try {
    if (!text || text.trim() === '') {
      return {
        categories: [],
        tags: []
      };
    }
    
    console.log('Analizando contenido de texto...');
    
    const systemPrompt = `Eres un asistente especializado en analizar contenido. 
    Extrae posibles categorías y etiquetas del siguiente texto. 
    Las categorías deben ser generales (ej: Cocina, Fitness, Desarrollo personal) y limítate a sugerir 1-3 categorías. 
    Las etiquetas deben ser más específicas y extraer palabras clave importantes del texto, sugiere 3-5 etiquetas.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parsear la respuesta JSON
    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      categories: result.categories || [],
      tags: result.tags || []
    };
    
  } catch (error) {
    console.error('Error al analizar el contenido de texto:', error);
    // En caso de error, devolver un objeto vacío
    return {
      categories: [],
      tags: []
    };
  }
};

module.exports = {
  transcribeAudio,
  analyzeTextContent
};
