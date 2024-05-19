import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Header.css";
import logo1 from "../asstes/stayfari logo.jpg";
import logo2 from "../asstes/Powered by Stayfari.png";
import { Context, server } from "../index.js";
import axios from "axios";

const Header = () => {
  const { isAuthenticated, isAuthenticatedAdmin, setIsAuthenticated, setIsAuthenticatedAdmin, user, setUser } = useContext(Context);

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      });
      setIsAuthenticatedAdmin(false);
      setIsAuthenticated(false);
      setUser({});
    } catch (error) {
      setIsAuthenticated(true);
      setIsAuthenticatedAdmin(true);
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <nav>
      <div>
        {/* <img src={logo1} alt="" className="logo logo1" /> */}
        <img src={logo2} alt="" className="logo logo2" />
      </div>
      <article>
        <Link to={"/"} className="nav-item">
          Home
        </Link>
        <Link to={"/profiles"} className="nav-item">
          Profiles
        </Link>

        {isAuthenticated ? (
          <div className="register">
            {isAuthenticatedAdmin && (
              <>
                <Link to={"/accessControl"} className="nav-item">
                  Access Control
                </Link>
                <Link to={"/register"} className="nav-item">
                  Create User
                </Link>
              </>
            )}
            <button className="nav-item" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        ) : (
          <Link to={"/login"} className="nav-item">
            Login
          </Link>
        )}
      </article>
    </nav>
  );
};

export default Header;
