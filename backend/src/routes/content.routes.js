const express = require('express');
const router = express.Router();
const multer = require('multer');
const Content = require('../models/Content.model');
const authMiddleware = require('../middleware/auth.middleware');
const { getSimulatedSavedPosts } = require('../utils/instagram.utils');
const { extractTextFromImage } = require('../utils/ocr.utils');
const { transcribeAudio, analyzeTextContent } = require('../utils/transcription.utils');

// Configuración de multer para subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Obtener todas las publicaciones guardadas
router.get('/saved', async (req, res) => {
  try {
    // En una implementación real, aquí obtendríamos las publicaciones guardadas de Instagram
    // const savedPosts = await fetchSavedPostsFromInstagram(req.user.accessToken);
    
    // Como la API de Instagram no permite acceso directo a las publicaciones guardadas,
    // utilizamos datos simulados para demostración
    const simulatedPosts = await getSimulatedSavedPosts();
    
    // Buscar contenido procesado en la base de datos
    const processedContent = await Content.find({ user: req.user._id });
    
    // Mapear los IDs de las publicaciones ya procesadas
    const processedIds = new Set(processedContent.map(item => item.instagramPostId));
    
    // Combinar datos simulados con información de la base de datos
    const savedPosts = simulatedPosts.map(post => {
      const isProcessed = processedIds.has(post.id);
      const processedData = isProcessed ? 
        processedContent.find(item => item.instagramPostId === post.id) : null;
      
      return {
        ...post,
        processed: isProcessed,
        extractedText: processedData?.extractedText || null,
        transcription: processedData?.transcription || null,
        categories: processedData?.categories || [],
        tags: processedData?.tags || []
      };
    });
    
    res.json({ savedPosts });
    
  } catch (error) {
    console.error('Error al obtener publicaciones guardadas:', error);
    res.status(500).json({ error: 'Error al obtener publicaciones guardadas' });
  }
});

// Obtener detalle de un contenido específico
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!content) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }
    
    res.json(content);
    
  } catch (error) {
    console.error('Error al obtener detalle del contenido:', error);
    res.status(500).json({ error: 'Error al obtener detalle del contenido' });
  }
});

// Extraer texto de una imagen (OCR)
router.post('/extract-text', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }
    
    const imageBuffer = req.file.buffer;
    const extractedText = await extractTextFromImage(imageBuffer);
    
    // Analizar el texto para obtener categorías y etiquetas sugeridas
    const { categories, tags } = await analyzeTextContent(extractedText);
    
    res.json({ 
      text: extractedText,
      suggestions: {
        categories,
        tags
      }
    });
    
  } catch (error) {
    console.error('Error en la extracción de texto:', error);
    res.status(500).json({ error: 'Error en la extracción de texto' });
  }
});

// Transcribir audio de un video
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo de audio' });
    }
    
    const audioBuffer = req.file.buffer;
    const transcription = await transcribeAudio(audioBuffer);
    
    // Analizar la transcripción para obtener categorías y etiquetas sugeridas
    const { categories, tags } = await analyzeTextContent(transcription);
    
    res.json({ 
      transcription,
      suggestions: {
        categories,
        tags
      }
    });
    
  } catch (error) {
    console.error('Error en la transcripción de audio:', error);
    res.status(500).json({ error: 'Error en la transcripción de audio' });
  }
});

// Guardar o actualizar un contenido procesado
router.post('/save', async (req, res) => {
  try {
    const { 
      instagramPostId, 
      mediaType, 
      mediaUrl, 
      permalink,
      extractedText, 
      transcription, 
      categories, 
      tags, 
      notes 
    } = req.body;
    
    if (!instagramPostId) {
      return res.status(400).json({ error: 'ID de publicación requerido' });
    }
    
    // Buscar si ya existe un contenido para esta publicación
    let content = await Content.findOne({ 
      user: req.user._id,
      instagramPostId
    });
    
    if (content) {
      // Actualizar contenido existente
      content.extractedText = extractedText || content.extractedText;
      content.transcription = transcription || content.transcription;
      content.categories = categories || content.categories;
      content.tags = tags || content.tags;
      content.notes = notes !== undefined ? notes : content.notes;
      content.lastProcessed = new Date();
      
      await content.save();
    } else {
      // Crear nuevo contenido
      content = await Content.create({
        user: req.user._id,
        instagramPostId,
        mediaType,
        mediaUrl,
        permalink,
        extractedText,
        transcription,
        categories: categories || [],
        tags: tags || [],
        notes: notes || '',
        savedAt: new Date(),
        lastProcessed: new Date()
      });
    }
    
    res.json({
      success: true,
      content
    });
    
  } catch (error) {
    console.error('Error al guardar contenido:', error);
    res.status(500).json({ error: 'Error al guardar contenido' });
  }
});

// Actualizar un contenido existente
router.patch('/:id', async (req, res) => {
  try {
    const { categories, tags, notes } = req.body;
    
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!content) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }
    
    // Actualizar campos si se proporcionan
    if (categories !== undefined) content.categories = categories;
    if (tags !== undefined) content.tags = tags;
    if (notes !== undefined) content.notes = notes;
    
    content.lastProcessed = new Date();
    await content.save();
    
    res.json({
      success: true,
      content
    });
    
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    res.status(500).json({ error: 'Error al actualizar contenido' });
  }
});

// Eliminar un contenido
router.delete('/:id', async (req, res) => {
  try {
    const result = await Content.deleteOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }
    
    res.json({
      success: true,
      message: 'Contenido eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar contenido:', error);
    res.status(500).json({ error: 'Error al eliminar contenido' });
  }
});

module.exports = router;
