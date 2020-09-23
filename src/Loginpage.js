import React from "react";
import firebase from "firebase";
import FirebaseAuth from "react-firebaseui/FirebaseAuth";
import Header from "./Header.js";
import "./LoginPage.scss";

export default function LoginPage() {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  function onSignInButtonClick() {
    // Open the Auth flow in a popup.

    window.open(
      `https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://localhost:8080/instagram-callback&scope=user_profile,user_media&response_type=code`,
      "firebaseAuth",
      "height=500,width=400"
    );
  }

  return (
    <div className="loginpage">
      <Header />
      <div className="login-options">
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        <button onClick={onSignInButtonClick}>Sign in with Instagram</button>
      </div>
    </div>
  );
}
