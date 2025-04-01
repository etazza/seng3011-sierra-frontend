import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataUpload } from "./components/DataUpload";
import { DataVisualisation } from "./components/DataVisualisation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/upload" element={<DataUpload />} />
        <Route path="/visualisation" element={<DataVisualisation />} />
      </Routes>
    </Router>
  );
}

export default App;