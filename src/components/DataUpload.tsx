import { useCognito } from '../hooks/useCognito';

export const DataUpload = () => {
  const { user, logout, login } = useCognito();

  if (!user) {
    return (
      <div className="text-center">
        <p>You need to be logged in to access this page.</p>
        <button
          onClick={login}
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