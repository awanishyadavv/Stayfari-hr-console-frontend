import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import Profiles from './pages/Profiles.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AccessControl from './pages/AccessControl.jsx';
import HumanResource from './pages/HumanResource/HumanResource.jsx';
import BlurPage from './hooks/BlurPage.jsx';
import { Context, server } from './index';

function App() {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    setIsAuthenticatedAdmin,
  } = useContext(Context);

  useEffect(() => {
    axios
      .get(`${server}/users/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
        if (res.data.user.role === 'admin') {
          setIsAuthenticatedAdmin(true);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        setUser({});
        setIsAuthenticated(false);
        setIsAuthenticatedAdmin(false);
        if (!isAuthenticated) return <Navigate to={'/login'} />;
      });
  }, [isAuthenticated, setUser, setIsAuthenticated, setIsAuthenticatedAdmin]);

  
  return (
    <Router>
      <Header />
      <BlurPage />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accessControl" element={<AccessControl />} />
        <Route path="/humanResource" element={<HumanResource />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
