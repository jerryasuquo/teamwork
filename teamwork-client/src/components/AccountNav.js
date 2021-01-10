import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/AccountNav.css";

export default class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="nav-box">
          <div className="logo-box">
            <Link to="/" className="logo-link">
              <p>
                <span className="logo-team">Team</span>work
              </p>
            </Link>
          </div>

          <div className="search-box">
            <i class="far fa-search"></i>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Find an Article"
            />
          </div>

          <div className="nav-links">
            <ul>
              <Link to="/signup">
                <li>SIGN UP</li>
              </Link>
              <Link to="/login">
                <li>LOG IN</li>
              </Link>
              <Link to="/how-it-works">
                <li>HOW IT WORKS</li>
              </Link>
            </ul>
          </div>
        </div>

        <div className="nav-border"></div>
      </div>
    );
  }
}
