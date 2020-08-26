import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import firebase from "firebase";
import LoginPage from "./LoginPage.js";
import LoggedInPages from "./LoggedInPages.js";
import "./App.scss";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoggedIn(user !== null);
      });

    return () => unregisterAuthObserver();
  }, []);

  if (loggedIn) {
    return (
      <LoggedInPages currentUser={currentUser}/>
    );
  } else {
    return (
      <Switch>
        <Route path="/*" >
          <Redirect to="/" />
          <LoginPage />
        </Route>
      </Switch>
    );
  }
}
