import React, { useState } from 'react';
import { newSession, sendMessage, uploadPDF, uploadAudio, getChatHistory } from '../utils/api';

const Chat = () => {
  const [sessionKey, setSessionKey] = useState(null);
  const [message, setMessage] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleNewSession = async () => {
    try {
      const key = await newSession();
      setSessionKey(key);
      fetchChatHistory(key);
    } catch (err) {
      setError('Failed to create new session');
    }
  };

  const handleSendMessage = async () => {
    if (sessionKey && message) {
      try {
        await sendMessage(sessionKey, message);
        setMessage('');
        fetchChatHistory(sessionKey);
      } catch (err) {
        setError('Failed to send message');
      }
    }
  };

  const handleUploadPDF = async () => {
    if (sessionKey && pdfFile) {
      try {
        await uploadPDF(sessionKey, pdfFile);
        setPdfFile(null);
        fetchChatHistory(sessionKey);
      } catch (err) {
        setError('Failed to upload PDF');
      }
    }
  };

  const handleUploadAudio = async () => {
    if (sessionKey && audioFile) {
      try {
        await uploadAudio(sessionKey, audioFile);
        setAudioFile(null);
        fetchChatHistory(sessionKey);
      } catch (err) {
        setError('Failed to upload audio');
      }
    }
  };

  const fetchChatHistory = async () => {
    if (sessionKey) {
      try {
        const data = await getChatHistory(sessionKey);
        console.log('Fetched chat history:', data);
        if (Array.isArray(data.chat_history)) {
          setChatHistory(data.chat_history);
        } else {
          console.error('Expected chat_history to be an array');
          setChatHistory([]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setChatHistory([]);
      }
    }
  };

  return (
    <div>
      <button onClick={handleNewSession}>Start New Session</button>

      {sessionKey && (
        <div>
          <h3>Session Key: {sessionKey}</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={handleSendMessage}>Send Message</button>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
          <button onClick={handleUploadPDF}>Upload PDF</button>

          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />
          <button onClick={handleUploadAudio}>Upload Audio</button>

          {error && <div className="error">{error}</div>}

          <div>
            <h4>Chat History</h4>
            <ul>
              {chatHistory.map((chat, index) => (
                <li key={index}>
                  <strong>{chat.sender_type}:</strong>
                  {chat.message_type === 'text' && <p>{chat.content}</p>}
                  {chat.message_type === 'image' && (
                    <img src={`data:image/jpeg;base64,${chat.content}`} alt="Chat Image" />
                  )}
                  {chat.message_type === 'audio' && (
                    <audio controls>
                      <source src={`data:audio/wav;base64,${chat.content}`} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default Chat;
