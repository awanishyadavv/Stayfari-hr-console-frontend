import React from "react";
import { Link } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader = () => {
  return (
    <nav className="admin-nav">
      <article className="admin-article">
        <Link to={"/open-roles"} className="admin-nav-item">
          Job Roles
        </Link>
        <Link to={"/register"} className="admin-nav-item">
          Users
        </Link>         
        <Link to={"/stages"} className="admin-nav-item">
          Stages
        </Link> 
      </article>
    </nav>
  );
};

export default AdminHeader;
