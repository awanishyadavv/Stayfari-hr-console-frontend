import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import HumanResource from "./pages/HumanResource/HumanResource.jsx";
import BlurPage from "./hooks/BlurPage.jsx";
import { Context, server } from "./index";
import AdminControls from "./pages/HrAdminControls/AdminControls.jsx";
import Register from "./pages/HrAdminControls/Register.jsx";
import AddJobRole from "./pages/HrAdminControls/AddJobRole.jsx";
import Stages from "./pages/HrAdminControls/Stages.jsx";
import Interviews from "./pages/HumanResource/Interviews.jsx";


function App() {
  const {
    user,
    setUser,
    isAuthenticated,
    isAuthenticatedAdmin,
    setIsAuthenticated,
    setIsAuthenticatedAdmin,
  } = useContext(Context);

  useEffect(() => {
    axios
      .get(`${server}/users/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
        if (res.data.user.role === "admin") {
          setIsAuthenticatedAdmin(true);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        setUser({});
        setIsAuthenticated(false);
        setIsAuthenticatedAdmin(false);
        if (!isAuthenticated) return <Navigate to={"/login"} />;
      });
  }, [isAuthenticated, setUser, setIsAuthenticated, setIsAuthenticatedAdmin]);

  const AdminRoute = ({ element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (!isAuthenticatedAdmin) {
      return <Navigate to="/" />;
    }
    return element;
  };

  return (
    <Router>
      <Header />
      <BlurPage />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/interviews" element={<Interviews/>} />
        <Route path="/humanResource" element={<HumanResource />} />
        <Route path="/admin-controls" element={<AdminRoute element={<AdminControls />} />} />
        <Route path="/register" element={<AdminRoute element={<Register />} />} />
        <Route path="/open-roles" element={<AdminRoute element={<AddJobRole />} />} />
        <Route path="/stages" element={<AdminRoute element={<Stages />} />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
