import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext'; // <--- Import this
import Login from './pages/Login';       // <--- Import Login
import Register from './pages/Register'; // <--- Import Register
import PublishShoe from './pages/PublishShoe'; // <--- Import
import SellerProfile from './pages/SellerProfile'; // <--- Import SellerProfile

function App() {
  return (
    <Router>
      <AuthProvider> {/* <--- WRAP EVERYTHING HERE */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sell" element={<PublishShoe />} />
          <Route path="/seller/:username" element={<SellerProfile />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;