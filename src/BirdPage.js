import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./BirdPage.scss";
import Sighting from "./Sighting.js";
import SightingForm from "./SightingForm";
import Header from "./Header";
import Bird from "./Bird.js";

// formatting for sighting list

export default function BirdPage(props) {
  const {
    instagramToken,
    setSelectedImages,
    currentUser,
    setError,
    updateSighting,
    isEditing,
    placeMarker,
    mapPin,
    selectSpecies,
    selectedImages,
    setIsEditing,
  } = props;

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
    const number = birdDetails.sightings.length - index;

    let ordinal;

    const keyString = number.toString();

    const keyLength = keyString.length;

    const lastDigit = keyString.substr(keyLength - 1);

    let lastTwoDigits;

    if (keyLength > 1) {
      lastTwoDigits = keyString.substr(keyLength - 2);
    }

    if (
      lastTwoDigits === "11" ||
      lastTwoDigits === "12" ||
      lastTwoDigits === "13"
    ) {
      //exeptions
      ordinal = `${keyString}th`;
    } else if (lastDigit === "1") {
      ordinal = `${keyString}st`;
    } else if (lastDigit === "2") {
      ordinal = `${keyString}nd`;
    } else if (lastDigit === "3") {
      ordinal = `${keyString}rd`;
    } else {
      ordinal = `${keyString}th`;
    }

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const dateTimeFormat = new Intl.DateTimeFormat("en-GB", dateOptions);

    const sightingDate = dateTimeFormat.format(new Date(sighting.datetime));

    return (
      <div className="list-item">
        <div className="link-container">
          <Link
            to={`/sightings/${sighting.id}`}
            key={index}
            className="sighting-link"
          >
            <h3>{ordinal} sighting</h3> <h4>{sightingDate}</h4>
          </Link>
        </div>
        <div className="color-block"></div>
      </div>
    );
  });

  console.log("sightings list is", sightingsList);

  return (
    <div>
      <Header loggedin="true" />
      <div className="full-bird-listing">
        <Bird
          setError={setError}
          currentUser={currentUser}
          birdID={birdID}
          birdDetails={birdDetails}
          setBirdDetails={setBirdDetails}
        />
        <div className="sightings-list">
          <h2>Your sightings</h2>
          <div className="color-block"></div>
          {sightingsList.length > 0 ? (
            sightingsList
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
