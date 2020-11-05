import React, { useState } from "react";
import logo from "./images/fledgling-logo.svg";
import "./Header.scss";
import UserMenu from './UserMenu.js';
import ListMenu from './ListMenu.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header(props) {
  const [userDisplay, setUserMenuDisplay] = useState(false);
  const [listDisplay, setListMenuDisplay] = useState(false);

  function displayUserMenu() {
    setUserMenuDisplay(!userDisplay);
  }

  function displayListMenu(){
    setListMenuDisplay(!listDisplay)
  }

  return (
    <div className="header">
      <img className="fledglingLogo" src={logo} alt="tbc"></img>
      <h1>Fledgling</h1>
      {props.loggedin && (
        <div className="headerIcons">
        <FontAwesomeIcon icon={faClipboardList} className="clipboardIcon" alt='list of birds'onClick={displayListMenu} size="2x"/>
        <FontAwesomeIcon icon={faUser} className="userIcon" alt='user settings'onClick={displayUserMenu} size="2x"/>
        </div>

      )}
      {listDisplay === true && <ListMenu currentUser={props.currentUser}/>}
      {userDisplay === true && <UserMenu currentUser={props.currentUser}/>}
    </div>
  );
}
