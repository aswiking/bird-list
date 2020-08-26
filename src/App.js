import React, {useState, useEffect} from "react";
import { Route, Switch } from "react-router-dom";
import firebase from 'firebase';
import HomePage from "./HomePage.js";
import LoginPage from "./LoginPage.js";
import SightingForm from "./SightingForm.js";
import ErrorMessage from "./ErrorMessage.js";
import "./styles/App.scss";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => {
        setCurrentUser(user);
        setLoggedIn(user !== null);
      }
    );

    return () => unregisterAuthObserver();
  }, []);

  return (
    <Switch>
      <Route path="/" exact>
        {loggedIn ? <HomePage currentUser={currentUser} /> : <LoginPage />}
      </Route>
      <Route path="/new-sighting" exact>
        <SightingForm currentUser={currentUser} />
      </Route>
      <Route path="/*">
        <ErrorMessage />
      </Route>
    </Switch>
  );
}
