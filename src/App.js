import React, {useState} from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./Homepage.js";
import LoginPage from "./Loginpage.js";
import ErrorMessage from "./ErrorMessage.js";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Switch>
      <Route path="/" exact>
        {loggedIn ? <HomePage /> : <LoginPage />}
      </Route>
      <Route path="/*">
        <ErrorMessage />
      </Route>
    </Switch>
  );
}
