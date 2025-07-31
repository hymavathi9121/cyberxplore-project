import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      });
      setMessage('Scan in progress...');
      setFile(null);
      setProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed. Try again.');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.docx,.jpg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Upload</button>
      {progress > 0 && <p>Uploading: {progress}%</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Upload;
