import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="#">Navbar</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link className="nav-link active" to="#">Active</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">Link</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">Link</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link disabled" to="#">Disabled</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;