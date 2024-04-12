import "./App.css";
import HackerEvents from "./components/hackerEvents";
import Login from "./components/login";
import Home from "./components/home";
import ViewEvent from "./components/viewEvent";
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hackerevents" element={<HackerEvents />} />
          <Route path="/:id" element={<ViewEvent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

