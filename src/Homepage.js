import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.scss";
import Header from "./Header.js";
import Card from "./Card.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function HomePage(props) {
  const sightingsList = props.sightingsData.map((sighting, index) => {
    return (
      <div>
        <div className="color-block"></div>
        <Card
          instagramToken={props.instagramToken}
          sighting={sighting}
          birdDetails={sighting.bird}
          page="homepage"
        />
      </div>
    );
  });

  return (
    <div className="homepage">
      <Header loggedin="true" currentUser={props.currentUser} userName={props.userName} />
      <div className="recentSightingsLog">
        <div className="recentSightingsHeader">
          <Link to="/new-sighting" className="plus-icon">
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="plus-icon"
              title="add new sighting"
            />
          </Link>
          <h1>Recent sightings</h1>
        </div>
        {sightingsList.length === 0 && (
          <div className="no-sightings-message">
            <p>Click the plus icon to add your first sighting</p>
          </div>
        )}
        <div className="list-with-photos">{sightingsList}</div>
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
