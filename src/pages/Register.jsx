import React, { useContext, useState } from "react";
import axios from "axios";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== rePassword) {
        toast.error("Passwords do not match");
        return;
      }

      const { data } = await axios.post(
        `${server}/users/new`,
        {
          name,
          email,
          employeeCode,
          password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      const userRole = data.role;
      toast.success(`User registered as ${userRole}`);
      resetForm();
      setIsRegistrationSuccess(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setEmployeeCode("");
    setRole("");
    setPassword("");
    setRePassword("");
  };

  if (isRegistrationSuccess) return <Navigate to={"/accessControl"} />;

  return (
    <div className="login register12">
      <h2>Register New User</h2>
      <section>
        <form onSubmit={submitHandler}>
          <div className="login-item">
            <p className="key">Name</p>
            <input
              className="value"
              value={name}
              type="text"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="login-item">
            <p className="key">Email</p>
            <input
              className="value"
              value={email}
              type="email"
              placeholder="Enter email"
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
              placeholder="Enter employee code"
              onChange={(e) => setEmployeeCode(e.target.value)}
              required
            />
          </div>
          <div className="login-item">
            <p className="key">Role</p>
            <input
              className="value"
              value={role}
              type="text"
              placeholder="Enter role"
              onChange={(e) => setRole(e.target.value)}
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
          <div className="login-item">
            <p className="key">Retype Password</p>
            <input
              className="value"
              value={rePassword}
              type="password"
              placeholder="Retype password"
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Register
          </button>
        </form>
      </section>
    </div>
  );
};

export default Register;
