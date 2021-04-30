import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./BirdPage.scss";
import Header from "./Header";
import Bird from "./Bird.js";
import Card from "./Card.js";

// formatting for sighting list

export default function BirdPage(props) {
  const { instagramToken, currentUser, setError } = props;

  const [birdDetails, setBirdDetails] = useState({
    id: null,
    common: null,
    scientific: null,
    uk_status: null,
    group: {
      common: null,
      scientific: null,
    },
    sightings: [],
  });

  const { birdID } = useParams();

  const sightingsList = birdDetails.sightings.map((sighting, index) => {

    const numberOfSightings = birdDetails.sightings.length;

    return (
      <div>
        <div className="color-block"></div>
      <Card
        key={index}
        sighting={sighting}
        index={index}
        numberOfSightings={numberOfSightings}
        instagramToken={instagramToken}
        page="birdpage"
      /></div>
    );
  });

  console.log("sightings list is", sightingsList);

  return (
    <div>
      <Header loggedin="true" userName={props.userName} setInstagramToken={props.setInstagramToken}/>
      <div className="full-bird-listing">
        <Bird
          setError={setError}
          currentUser={currentUser}
          birdID={birdID}
          birdDetails={birdDetails}
          setBirdDetails={setBirdDetails}
        />
        <div className="sightings-list">
          <h1>Your sightings</h1>
          {sightingsList.length > 0 ? (
            <div className="list-with-photos">{sightingsList}</div>
          ) : (
            <div className="no-sightings-message">
              <p>You have no sightings of {birdDetails.common}s</p>
              <Link to="/new-sighting" className="new-sighting-link">
                <p>Add sighting</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
