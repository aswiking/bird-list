import React from "react";
import logo from './images/fledgling-logo.svg';
import userIcon from './images/user-icon.svg';
import "./Header.scss";

export default function Header(props) {
  return (
    <div classname="header">
      <img classname='fledglingLogo' src={logo}></img>
      <h1>Fledgling</h1>
      {props.loggedin &&
      <img classname='userIcon' src={userIcon}></img>
      }
    </div>
  )
}