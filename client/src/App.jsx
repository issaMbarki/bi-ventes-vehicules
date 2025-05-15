// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import DecisionPage from "./components/DecisionPage";
import AOS from "aos";
import "aos/dist/aos.css";

// src/App.jsx
export default function App() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-16" />{" "}
        {/* Espace de 5rem pour compenser la navbar fixe */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/decisions" element={<DecisionPage />} />
        </Routes>
      </div>
    </Router>
  );
}
