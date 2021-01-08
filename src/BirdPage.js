import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./BirdPage.scss";
import Sighting from "./Sighting.js";
import SightingForm from "./SightingForm";
import Header from "./Header";
import Bird from "./Bird.js";

// infinite loop? Making lotz of requests

// formatting for sighting list

export default function BirdPage(props) {
  const {
    instagramToken,
    setSelectedImages,
    currentUser,
    setError,
    setMapPin,
    updateSighting,
    isEditing,
    placeMarker,
    mapPin,
    selectSpecies,
    selectedImages,
    setIsEditing
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

  const sightingsList = birdDetails.sightings.map((sighting) => {
    if (!isEditing) {
      return (
        <Sighting
          currentUser={currentUser}
          sightingDetails={sighting}
          instagramToken={instagramToken}
          setIsEditing={setIsEditing}
        />
      );
    } else {
      return (
        <SightingForm
          currentUser={currentUser}
          submitSighting={updateSighting}
          placeMarker={placeMarker}
          mapPin={mapPin}
          setMapPin={setMapPin}
          selectSpecies={selectSpecies}
          instagramUid={props.instagramUid}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          setIsEditing={setIsEditing}
          formType="edit"
        />
      );
    }
  });

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
        {(sightingsList.length > 0) ? ({sightingsList}) : (<div className="no-sightings-message"><p>You have no sightings of {birdDetails.common}</p></div>) }
        
      </div>
    </div>
  );
}
