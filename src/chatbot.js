import React, { useState } from 'react';
import { sendMessageToChatGPT } from './chatgptapi'; // Importa la función de ChatGPT
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [showEmotions, setShowEmotions] = useState(false);
  const [videoUrl, setVideoUrl] = useState(''); // Para guardar la URL del video

  // Función para obtener un video relacionado de YouTube
  const fetchVideo = async (emotion) => {
    try {
      // Definir la búsqueda de acuerdo con la emoción seleccionada
      let searchQuery = '';
  
      // Filtrado basado en la emoción seleccionada
      switch (emotion.toLowerCase()) {
        case 'estoy feliz':
          searchQuery = 'videos felices para niños con TEA ';
          break;
        case 'estoy triste':
          searchQuery = 'videos alegres para niños con TEA que les ayuden a sentirse mejor';
          break;
        case 'estoy enojado':
          searchQuery = 'videos relajantes para niños con TEA';
          break;
        case 'estoy asustado':
          searchQuery = 'videos alegres y calmantes para niños con TEA';
          break;
        default:
          searchQuery = `${emotion} para niños con TEA educativos`; // Valor por defecto si la emoción no está definida
      }
  
      // Realizar la búsqueda de video en YouTube
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: searchQuery, // Buscar con el término filtrado por emoción
          key: 'APIKEYDEYOUTUBE', // Tu clave de API de YouTube
          type: 'video', // Solo videos
          videoDefinition: 'high', // Filtrar solo videos en alta definición
        },
      });
  
      // Obtener el primer video de los resultados
      const videoId = response.data.items[0]?.id?.videoId;
      if (videoId) {
        setVideoUrl(`https://www.youtube.com/embed/${videoId}`); // Establecer la URL del video
      } else {
        console.log("No se encontraron videos para esta emoción.");
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };
  
  

  // Función que cambia la visibilidad de las emociones al hacer clic en el botón "Emociones"
  const toggleEmotions = () => {
    setShowEmotions(!showEmotions);
  };

  // Función para manejar la selección de una emoción
  const handleOptionSelect = async (option) => {
    const chatResponse = await sendMessageToChatGPT(option);
    setMessages([
      ...messages,
      { role: 'user', content: option },
      { role: 'assistant', content: chatResponse },
    ]);
    // Buscar video relacionado con la emoción seleccionada
    fetchVideo(option);
  };

  return (
    <div>
      <h1>Chatbot para Niños con TEA</h1>
      <div className="chatbox">
      {messages.map((msg, index) => (
          <p key={index}><strong>{msg.role === 'user' ? 'Tú' : 'Chatbot'}:</strong> {msg.content}</p>
        ))}
      </div>

      {/* Botón de emociones */}
      <button onClick={toggleEmotions} className="button">Emociones</button>

      {/* Sección de Emojis solo si showEmotions es true */}
      {showEmotions && (
        <div className="emoji-section">
          <h2>¿Cómo te sientes?</h2>
          <div className="emoji-grid">
            <button onClick={() => handleOptionSelect("Estoy feliz")}>
              <span role="img" aria-label="feliz">😊</span> Feliz
            </button>
            <button onClick={() => handleOptionSelect("Estoy triste")}>
              <span role="img" aria-label="triste">😢</span> Triste
            </button>
            <button onClick={() => handleOptionSelect("Estoy enojado")}>
              <span role="img" aria-label="enojado">😡</span> Enojado
            </button>
            <button onClick={() => handleOptionSelect("Estoy asustado")}>
              <span role="img" aria-label="asustado">😨</span> Asustado
            </button>
          </div>
        </div>
      )}

      {/* Mostrar video si se ha seleccionado una emoción */}
      {videoUrl && (
        <div className="video-container">
          <h3>Video Relacionado:</h3>
          <iframe
            width="560"
            height="315"
            src={videoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Emoción relacionada"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
