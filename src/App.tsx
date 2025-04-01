import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DataUpload } from './components/DataUpload';
import { DataVisualisation } from './components/DataVisualisation';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DataVisualisation />} />
          <Route path="/upload" element={<DataUpload />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;