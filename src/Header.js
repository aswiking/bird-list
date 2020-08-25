import React from "react";
import logo from './images/fledgling-logo.svg';
import userIcon from './images/user-icon.svg';
import "./Header.scss";

export default function Header(props) {
  return (
    <div className="header">
      <img className='fledglingLogo' src={logo} alt="tbc"></img>
      <h1>Fledgling</h1>
      {props.loggedin &&
      <img className='userIcon' src={userIcon} alt="tbc"></img>
      }
    </div>
  )
}