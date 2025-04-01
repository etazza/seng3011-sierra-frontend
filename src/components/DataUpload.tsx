import { useCognito } from '../hooks/useCognito';
import { useState } from 'react';
import { collectionEndpoint } from '../data/api';

export const DataUpload = () => {
  const { user, logout } = useCognito();
  const [file, setFile] = useState<File | null>(null);

  if (!user) {
    return (
      <div className="text-center">
        <p>You need to be logged in to access this page.</p>
        <button onClick={() => logout()} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch(collectionEndpoint, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert('File uploaded successfully');
        })
        .catch((error) => {
          alert('Error uploading file');
        });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2>Upload Data</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Upload File
      </button>
    </div>
  );
};