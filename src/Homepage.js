import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.scss";
import Header from "./Header.js";
import SightingEntry from "./SightingEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function HomePage(props) {

  const sightingsList = props.sightingsData.map((sighting) => {
    return (
      <SightingEntry
        sighting={sighting}
      />
    )
  });

  return (
    <div className="homepage">
      <Header loggedin="true" currentUser={props.currentUser} />
      <div className="bodyBox recentSightingsLog">
        <div className="bodyBoxHeader recentSightingsHeader">
          <h1>Recent sightings</h1>
          <Link to="/new-sighting">
            <FontAwesomeIcon icon={faPlusCircle} />
          </Link>
        </div>
        {sightingsList}
        {props.error &&
          (props.error.status ? (
            <div className="error">
              {props.error.message} because:{" "}
              {props.error.messages.map((message) => (
                <span>{message}</span>
              ))}
            </div>
          ) : (
            <div className="error">Could not fetch data</div>
          ))}
      </div>
    </div>
  );
}
