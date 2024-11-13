// ImageUploader.jsx

import React, { useState } from 'react';
import { uploadImage } from '../utils/api'; // Adjust path if needed

const ImageUploader = ({ sessionKey }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (file && sessionKey) {
      try {
        const response = await uploadImage(sessionKey, file);
        console.log('Image upload response:', response);
        setFile(null); // Clear the file input after upload
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || !sessionKey}>
        Upload Image
      </button>
    </div>
  );
};

export default ImageUploader;
