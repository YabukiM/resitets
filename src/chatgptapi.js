import axios from 'axios';

const chatGptApiKey = 'APIENNOTAS';
const youtubeApiKey = 'APIENOTAS'; // Reemplaza con tu clave de API de YouTube

// Función para enviar mensaje a ChatGPT
export const sendMessageToChatGPT = async (message) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${chatGptApiKey}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error al conectar con ChatGPT:', error);
    return 'Lo siento, no puedo responder en este momento.';
  }
};

// Función para buscar videos en YouTube
export const searchYouTubeVideos = async (emotion) => {
  try {
    const query = `${emotion} para niños con TEA`; // Búsqueda personalizada por emoción
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,            // El término de búsqueda
        type: 'video',       // Solo buscar videos
        videoDefinition: 'high',  // Filtrar por definición alta de video
        key: youtubeApiKey,  // Tu clave de API de YouTube
      },
    });

    return response.data.items; // Devolver los resultados de la búsqueda
  } catch (error) {
    console.error('Error al buscar en YouTube:', error);
    return []; // En caso de error, devolver un array vacío
  }
};
