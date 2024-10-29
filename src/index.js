import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createContext } from 'react';
import axios from 'axios';
import './index.css';


// const originalServer = "http://localhost:5000"
export const originalServer = "https://stayfari-hr-console-backend-1.onrender.com";
// export const originalServer = "https://4828-182-156-189-158.ngrok-free.app";


export const server = `${originalServer}/api/v1`;

export const Context = createContext({ isAuthenticated: false, isAuthenticatedAdmin: false, user: {} });

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider value={{ isAuthenticated, setIsAuthenticated, isAuthenticatedAdmin, setIsAuthenticatedAdmin, user, setUser }}>
      <App />
    </Context.Provider>
  );
};

const wakeServer = async () => {
  try {
    console.log(originalServer)
    await axios.get(`${originalServer}/`);
    alert('Server woke successfully');
  } catch (error) {
    alert('Error waking the server:', error);
  }
};

setInterval(wakeServer, 12 * 60 * 1000); 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
