import React, { useState } from "react";
import logo from "./images/fledgling-logo.svg";
import userIcon from "./images/user-icon.svg";
import "./Header.scss";
import UserMenu from './UserMenu.js';

export default function Header(props) {
  const [menuDisplay, setMenuDisplay] = useState(false);

  function displayMenu() {
    setMenuDisplay(!menuDisplay);
  }
  return (
    <div className="header">
      <img className="fledglingLogo" src={logo} alt="tbc"></img>
      <h1>Fledgling</h1>
      {props.loggedin && (
        <img
          className="userIcon"
          src={userIcon}
          alt="tbc"
          onClick={displayMenu}
        ></img>
      )}
      {menuDisplay === true && <UserMenu currentUser={props.currentUser}/>}
    </div>
  );
}
