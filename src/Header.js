import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./images/fledgling-logo.svg";
import "./Header.scss";
import UserMenu from "./UserMenu.js";
import ListMenu from "./ListMenu.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header(props) {
  const [userDisplay, setUserMenuDisplay] = useState(false);
  const [listDisplay, setListMenuDisplay] = useState(false);

  function displayUserMenu() {
    setUserMenuDisplay(!userDisplay);
  }

  return (
    <div className="header">
      <Link to="/" className="logo-and-name">
        {" "}
        <img className="fledglingLogo" src={logo} alt="tbc"></img>
        <h1>Fledgling</h1>
      </Link>
      {props.loggedin && (
        <div className="headerIcons">
          <Link to="/all-birds">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="clipboardIcon headerIcon"
              alt="clipboard icon"
              title="full list of birds"
            />
          </Link>
          <FontAwesomeIcon
            icon={faUser}
            className="userIcon headerIcon"
            alt="user settings"
            onClick={displayUserMenu}
            title="user options"
          />
        </div>
      )}
      {listDisplay === true && <ListMenu currentUser={props.currentUser} />}
      <div className={`menu ${userDisplay === true ? "active" : "inactive"}`}>
        <UserMenu currentUser={props.currentUser} userName={props.userName} />
      </div>
    </div>
  );
}
