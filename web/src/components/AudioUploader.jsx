import React, { useState } from 'react';
import { uploadAudio } from '../utils/api';

const AudioUploader = ({ sessionKey }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (file && sessionKey) {
      try {
        const transcription = await uploadAudio(sessionKey, file);
        console.log('Transcription:', transcription);
        // You can handle the transcription as needed, e.g., adding it to the chat
        setFile(null);
      } catch (err) {
        console.error('Error uploading audio:', err);
      }
    }
  };

  return (
    <div className="audio-uploader">
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || !sessionKey}>
        Upload Audio
      </button>
    </div>
  );
};

export default AudioUploader;