import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import firebase from "firebase";
import FirebaseAuth from "react-firebaseui/FirebaseAuth";
import Header from "./Header.js";
import "./LoginPage.scss";
import apiFetch from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage(props) {
  const { setInstagramToken, setInstragramUid } = props;
  const history = useHistory();

  const location = useLocation();
  useEffect(() => {
    const parsed = queryString.parse(location.search);

    if (parsed.code) {
      history.replace({ search: "" });

      async function retrieveToken() {
        let res;

        res = await apiFetch(
          "/api/login/instagram",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: parsed.code }),
          },
          "Could not retrieve token"
        );
        const response = await res.json();

        console.log(response.firebaseToken);

        setInstagramToken(response.instagramToken);
        localStorage.setItem("instagramToken", response.instagramToken);

        setInstragramUid(response.instagramUserID);

        firebase.auth().signInWithCustomToken(response.firebaseToken);
      }
      retrieveToken();

      //log in to firebase
    }
  }, [location.search, setInstagramToken, setInstragramUid, history]);

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

  // function onSignInButtonClick() {
  //   // Open the Auth flow in a popup.

  //   window.open(
  //     `https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://localhost:3000/&scope=user_profile,user_media&response_type=code`,
  //     "firebaseAuth",
  //     "height=500,width=400"
  //   );
  // }

  return (
    <div className="loginpage">
      <Header />
      <div className="body">
        <div className="login-options">
          <a
            href={`https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://localhost:3000/&scope=user_profile,user_media&response_type=code`}
          >
            <div className="button-container">
              <button className="instagram-button">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="instagramIcon"
                  alt="instagram icon"
                  title="instagram"
                  size="2x"
                />
                <p>Sign in with Instagram</p>
              </button>
            </div>
          </a>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>
    </div>
  );
}
