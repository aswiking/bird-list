import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header.js";
import dodo from "./images/dodo.svg";
import "./ErrorMessage.scss";

export default function ErrorMessage(props) {
  return (
    <div>
      <Header
        loggedin="true"
        userName={props.userName}
        setInstagramToken={props.setInstagramToken}
      />
      <div className="error-message">
          <div className="content">
        <p>Sorry, this page doesn't exist :(</p>
        <img className="dodo" src={dodo} alt="drawing of a dodo"></img>
        <Link to='/'><h2>Back to homepage</h2></Link>
        </div>
      </div>
    </div>
  );
}
