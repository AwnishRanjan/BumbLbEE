import React, { useState } from 'react';
import { uploadPDF } from '../utils/api';

const PDFUploader = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    if (files.length > 0) {
      try {
        const success = await uploadPDF(files);
        if (success) {
          onUploadSuccess(true);
          setFiles([]);
        }
      } catch (err) {
        console.error('Error uploading PDF:', err);
      }
    }
  };

  return (
    <div className="pdf-uploader">
      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={files.length === 0}>
        Upload PDFs
      </button>
    </div>
  );
};

export default PDFUploader;