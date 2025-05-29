import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DebutantRSVP from './DebutantRsvp';
import AdminPage from './AdminPage';

function App() {
  return (
        <Router>
      <Routes>
        <Route path="/" element={<DebutantRSVP />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App;
