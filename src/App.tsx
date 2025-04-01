import { Routes, Route } from 'react-router-dom';
import { DataUpload } from './components/DataUpload';
import { DataVisualisation } from './components/DataVisualisation';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>  {/* Authentication context provider */}
      <Routes>
        <Route path="/" element={<DataVisualisation />} />
        <Route path="/upload" element={<DataUpload />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;