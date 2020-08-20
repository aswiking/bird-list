import React from "react";
import firebase from "firebase";
import FirebaseAuth from "react-firebaseui/FirebaseAuth";
import Header from './Header.js';

export default function LoginPage() {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  return (
    <div className="loginpage">
      <Header />
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}
