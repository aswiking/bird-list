import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import firebase from "firebase";
import LoginPage from "./LoginPage.js";
import LoggedInPages from "./LoggedInPages.js";
import "./App.scss";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [instagramUid, setInstragramUid] = useState(null);
  const [instagramToken, setInstagramToken] = useState(null);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user !== null && localStorage.getItem('instagramToken')) {
          setInstagramToken(localStorage.getItem('instagramToken'));
        }
        setCurrentUser(user);
        setLoggedIn(user !== null);
      });

    return () => unregisterAuthObserver();
  }, []);

  if (loggedIn) {
    return (
      <LoggedInPages currentUser={currentUser} instagramUid={instagramUid} instagramToken={instagramToken} />
    );
  } else {
    return (
      <Switch>
        <Route path="/*" >
          <LoginPage setInstragramUid={setInstragramUid} setInstagramToken={setInstagramToken}/>
        </Route>
      </Switch>
    );
  }
}
