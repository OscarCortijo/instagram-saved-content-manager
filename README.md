# Instagram Saved Content Manager

Herramienta para extraer, transcribir y gestionar contenido guardado de Instagram

## Características

- Acceso a publicaciones guardadas de Instagram
- Transcripción automática de videos
- Extracción de texto de imágenes (OCR)
- Categorización y etiquetado de contenido
- Sistema de búsqueda por palabras clave
- Recordatorios para revisar contenido guardado

## Arquitectura

### Frontend
- React.js para la interfaz de usuario
- Tailwind CSS para estilos

### Backend
- Node.js con Express
- API de Instagram para acceso a contenido guardado
- Servicios de OCR y transcripción de audio

### Base de datos
- MongoDB para almacenamiento de datos extraídos

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/instagram-saved-content-manager.git

# Instalar dependencias del backend
cd instagram-saved-content-manager/backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Configuración

1. Crear una aplicación en [Meta for Developers](https://developers.facebook.com/)
2. Configurar las variables de entorno (ver `.env.example`)
3. Configurar servicios de OCR y transcripción

## Uso

```bash
# Iniciar el backend
cd backend
npm start

# Iniciar el frontend
cd ../frontend
npm start
```

## Licencia

MIT
