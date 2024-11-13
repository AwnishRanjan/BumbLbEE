// App.jsx

import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import SessionSelector from './components/SessionSelector';
import PDFUploader from './components/PDFUploader';
import AudioUploader from './components/AudioUploader';
import ImageUploader from './components/ImageUploader';
import VoiceRecorder from './components/VoiceRecorder';
import { newSession, getChatSessions, deleteSession, clearCache, togglePDFChat } from './utils/api'; // Ensure this path is correct
import './App.css';

const App = () => {
  const [sessionKey, setSessionKey] = useState('');
  const [sessions, setSessions] = useState([]);
  const [pdfChatEnabled, setPdfChatEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const chatSessions = await getChatSessions();
      setSessions(chatSessions.chat_sessions);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to fetch sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const newSessionKey = await newSession();
      setSessions([...sessions, newSessionKey]);
      setSessionKey(newSessionKey);
    } catch (err) {
      console.error('Error creating new session:', err);
      setError('Failed to create a new session. Please try again.');
    }
  };

  const handleDeleteSession = async (key) => {
    try {
      await deleteSession(key);
      await fetchSessions();
      if (key === sessionKey) {
        setSessionKey('');
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete the session. Please try again.');
    }
  };

  const handlePDFToggle = async (enabled) => {
    try {
      await togglePDFChat(enabled);
      setPdfChatEnabled(enabled);
    } catch (err) {
      console.error('Error toggling PDF chat:', err);
      setError('Failed to toggle PDF chat. Please try again.');
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache();
    } catch (err) {
      console.error('Error clearing cache:', err);
      setError('Failed to clear cache. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <h1>BUMBLEBEE.Ai</h1>
      <div className="sidebar">
        <SessionSelector
          sessions={sessions}
          currentSession={sessionKey}
          onSelectSession={setSessionKey}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
        <div className="toggles">
          <label>
            <input
              type="checkbox"
              checked={pdfChatEnabled}
              onChange={(e) => handlePDFToggle(e.target.checked)}
            />
            PDF Chat
          </label>
        </div>
        <PDFUploader onUploadSuccess={() => setPdfChatEnabled(true)} />
        <AudioUploader sessionKey={sessionKey} />
        <ImageUploader sessionKey={sessionKey} />
        <VoiceRecorder sessionKey={sessionKey} />
        <button onClick={handleClearCache}>Clear Cache</button>
      </div>
      <div className="main-content">
        {sessionKey && (
          <Chat sessionKey={sessionKey} pdfChatEnabled={pdfChatEnabled} />
        )}
      </div>
    </div>
  );
};

export default App;
