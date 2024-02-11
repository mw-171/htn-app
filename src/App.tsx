import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ListEvents from "./components/listEvents";
import HackerEvents from "./components/hackerEvents";
import Home from "./components/home";
import ViewEvent from "./components/viewEvent";
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <div className="font-bold text-2xl">hi</div>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    // <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hackerevents" element={<HackerEvents />} />
        <Route path="/:id" element={<ViewEvent />} />
        {/* <Route 
            path="/events" 
            element={
              ({ isAuthenticated }: { isAuthenticated: boolean }) => {
                return isAuthenticated ? <ListEvents /> : <Login />;
              }} 
              }
          /> */}
      </Routes>
    </Router>
    // </AuthProvider>
  );
}

export default App;
