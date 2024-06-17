import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createContext } from 'react'
import './index.css';

export const server = "https://stayfari-hr-console-backend-1.onrender.com/api/v1"

export const Context = createContext({ isAuthenticated: false, isAuthenticatedAdmin:false, user:{} })

const AppWrapper = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthenticated, setIsAuthenticated, isAuthenticatedAdmin, setIsAuthenticatedAdmin, user, setUser
      }}>
      <App/>
    </Context.Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper/>
  </React.StrictMode>
);
