import React from "react";
import { Outlet, Link } from "react-router-dom";
import classes from "./mainHeader.module.css";
const MainHeader = () => {
  return (
    <>
      <header className={classes.header}>
        <nav>
          <ul className={classes.navLeft}>
            <li>
              <Link className={classes.Ullink} to="/user">
                Login
              </Link>
            </li>
            <li>
              <Link className={classes.Ullink} to="/">
                Result of Poll
              </Link>
            </li>
            <li>
              <Link className={classes.Ullink} to="/ceate-poll">
                Create Poll
              </Link>
            </li>
            <li>
              <Link className={classes.Ullink} to="/vote-poll">
                Vote in poll
              </Link>
            </li>
            <li>{/* <Link to="/qr-page">Qr-Page</Link> */}</li>
          </ul>
          <ul className={classes.navRight}>
            <li className={classes.logOut}>
              {/* <Link to="/logout">LogOut</Link> */}
              Logout
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default MainHeader;
