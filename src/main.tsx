import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router here
import App from './App';
import './index.css';  // Any global styles

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>  {/* Wrap the entire app with Router */}
    <App />
  </Router>
);