import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./BirdPage.scss";
import Sighting from "./Sighting.js";
import SightingForm from "./SightingForm";
import Header from "./Header";
import Bird from "./Bird.js";

// make sighting component and conditional statement which renders one or all sightings depending on renderType

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
        {sightingsList}
      </div>
    </div>
  );
}
