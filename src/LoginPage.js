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
import {  faMapMarkerAlt, faCalendar, faFeatherAlt } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage(props) {
  const { setInstagramToken, setInstagramUid } = props;
  const history = useHistory();

  console.log("process.env is", process.env)

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

        setInstagramToken(response.instagramToken);

        localStorage.setItem("instagramToken", response.instagramToken);

        setInstagramUid(response.instagramUserID);

        firebase.auth().signInWithCustomToken(response.firebaseToken);
      }
      retrieveToken();

      //log in to firebase
    }
  }, [location.search, setInstagramToken, setInstagramUid, history]);

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers. *DISABLED FOR NOW
    signInOptions: [
      // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
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
        <div className="description">
          <p>Keep track of your bird sightings:</p>
          <div className="bold what-where-when-container">
            <div className="what-where-when what">
              <FontAwesomeIcon
                icon={faFeatherAlt}
                className="tickIcon"
                alt="feather"
                size="1x"
              />
              <p>what</p>
            </div>
            <div className="what-where-when where">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="tickIcon"
                alt="clipboard"
                size="1x"
              />
              <p>where</p>
            </div>{" "}
            <div className="what-where-when when">
              <FontAwesomeIcon
                icon={faCalendar}
                className="tickIcon"
                alt="calendar"
                size="1x"
              />
              <p>when</p>
            </div>
          </div>
        </div>
        <div className="login-options">
        <p className="login-options-title">Log in or sign up</p>
          <a
            href={`https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://aswiking-fledgling.netlify.app/&scope=user_profile,user_media&response_type=code`}
          >
            <div className="button-container">
              <button className="instagram-button hover-pointer">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="instagramIcon"
                  alt="instagram icon"
                  title="instagram"
                  size="2x"
                />
                <p>Instagram</p>
              </button>
            </div>
          </a>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>
    </div>
  );
}
