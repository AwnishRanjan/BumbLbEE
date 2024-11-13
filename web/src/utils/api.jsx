const API_URL = 'http://localhost:8000';
export const getChatSessions = async () => {
  const response = await fetch(`${API_URL}/sessions/`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat sessions');
  }
  return response.json();
};
export const newSession = async () => {
  const response = await fetch(`${API_URL}/new_session/`, { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to create new session');
  }
  const data = await response.json();
  return data.session_key;
};
export const sendMessage = async (sessionKey, message) => {
  const response = await fetch(`${API_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ session_key: sessionKey, user_input: message })
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
};
export const uploadPDF = async (sessionKey, file) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('session_key', sessionKey);

  const response = await fetch(`${API_URL}/upload/pdf/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
  return response.json();
};
export const uploadAudio = async (sessionKey, file) => {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('session_key', sessionKey);
  const response = await fetch(`${API_URL}/upload/audio/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload audio');
  }
  return response.json();
};
export const uploadImage = async (sessionKey, file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('session_key', sessionKey);

  const response = await fetch(`${API_URL}/upload/image/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  return response.json();
};

export const togglePDFChat = async (enabled) => {
  const response = await fetch(`${API_URL}/toggle_pdf_chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle PDF chat mode');
  }
  return response.json();
};



export const getChatHistory = async (sessionKey) => {
  const response = await fetch(`${API_URL}/chat/history/?session_key=${sessionKey}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  return response.json();
};

export const sendAudioMessage = async (sessionKey, file) => {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('session_key', sessionKey);

  const response = await fetch(`${API_URL}/upload/audio/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload audio');
  }
  return response.json();
};

export const clearCache = async () => {
  const response = await fetch(`${API_URL}/clear_cache/`, { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to clear cache');
  }
  return response.json();
};

export const deleteSession = async (sessionKey) => {
  const response = await fetch(`${API_URL}/session/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ session_key: sessionKey })
  });

  if (!response.ok) {
    throw new Error('Failed to delete session');
  }
  return response.json();
};
