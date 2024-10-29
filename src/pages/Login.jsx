import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import "../styles/Login.css";
import logoLogin from '../asstes/logoLogin.webp'

const Login = () => {
  const [email, setEmail] = useState("");
  const [employeeCode, settEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated, setIsAuthenticatedAdmin, user, setUser } =
    useContext(Context);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/users/login`,
        {
          email,
          employeeCode,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setUser(data.user);
      const role = data.role;
      if (role === "admin") {
        setIsAuthenticated(true);
        setIsAuthenticatedAdmin(true);
        toast.success(`You are an ${role}`);
      } else {
        setIsAuthenticated(true);
        toast.success(`You are an ${role}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
      setIsAuthenticated(false);
      setIsAuthenticatedAdmin(false);
    }
  };

  if (isAuthenticated) return <Navigate to={"/"} />;

  return (
    <div className="login">
      <img src={logoLogin} alt="" className="login-logo"/>
      <section>
        <form onSubmit={submitHandler}>
          <div className="login-item">
            <p className="key">Email</p>
            <input
              className="value"
              value={email}
              type="email"
              placeholder="Enter registerd email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-item">
            <p className="key">Employee Code</p>
            <input
              className="value"
              value={employeeCode}
              type="text"
              placeholder="Enter your employee code"
              onChange={(e) => settEmployeeCode(e.target.value)}
              required
            />
          </div>
          <div className="login-item">
            <p className="key">Password</p>
            <input
              className="value"
              value={password}
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
