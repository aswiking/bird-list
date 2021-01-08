import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header.js";
import Bird from "./Bird.js";
import Sighting from "./Sighting.js";
import SightingForm from "./SightingForm.js";

export default function SightingPage(props) {
  const {
    instagramToken,
    setSelectedImages,
    currentUser,
    setError,
    setMapPin,
    isEditing,
    updateSighting,
    setIsEditing
  } = props;

  const [sightingDetails, setSightingDetails] = useState({
    lat: 52.610044,
    lng: -1.156774,
    datetime: "2020-01-01",
    bird: {
      id: null,
      common: null,
      scientific: null,
      uk_status: null,
      group: {
        common: null,
        scientific: null,
      },
    },
  });

  const { sightingID } = useParams();

  return (
    <div className="sighting-page">
      <Header loggedin="true" />
      <Bird
        setError={setError}
        currentUser={currentUser}
        birdDetails={sightingDetails.bird}
      />
      {!isEditing ? (
        <Sighting
          isEditing={props.isEditing}
          currentUser={currentUser}
          setError={setError}
          setSelectedImages={setSelectedImages}
          sightingID={sightingID}
          sightingDetails={sightingDetails}
          setSightingDetails={setSightingDetails}
          instagramToken={instagramToken}
          setIsEditing={setIsEditing}
        />
      ) : (
        <SightingForm
          sightingDetails={sightingDetails}
          setSightingDetails={setSightingDetails}
          instagramToken={instagramToken}
          formType="edit"
          selectedImages={props.selectedImages}
          setSelectedImages={props.setSelectedImages}
          submitSighting={props.submitSighting}
          placeMarker={props.placeMarker}
          mapPin={props.mapPin}
          setMapPin={setMapPin}
          updateSighting={updateSighting}
          deleteSighting={props.deleteSighting}
          setIsEditing={setIsEditing}

        />
      )}
    </div>
  );
}
