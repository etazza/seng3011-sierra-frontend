import { useCognito } from '../hooks/useCognito';
import { useState } from 'react';
import { collectionEndpoint } from '../data/api';

export const DataUpload = () => {
  const { user, logout, login } = useCognito();
  const [file, setFile] = useState<File | null>(null);

  if (!user) {
    return (
      <div className="text-center">
        <p>You need to be logged in to access this page.</p>
        <button
          onClick={login}  // Call Cognito login flow
          className="bg-green-500 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Upload Data</h2>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
};