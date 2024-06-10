import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Header.css";
import logo2 from "../asstes/Powered by Stayfari.png";
import { Context, server } from "../index.js";
import axios from "axios";

const Header = () => {
  const { isAuthenticated, isAuthenticatedAdmin, setIsAuthenticated, setIsAuthenticatedAdmin, setUser } = useContext(Context);

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
        <Link to={"/interviews"} className="nav-item">
          Interview
        </Link>         
        <Link to={"/humanResource"} className="nav-item">
          Candidates
        </Link> 

        {isAuthenticated ? (
          <div className="register">
            {isAuthenticatedAdmin && (
              <>
                <Link to={"/admin-controls"} className="nav-item">
                  Admin
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
