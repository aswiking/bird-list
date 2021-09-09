import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header.js";
import Bird from "./Bird.js";
import Sighting from "./Sighting.js";
import SightingForm from "./SightingForm.js";
import "./SightingPage.scss";

export default function SightingPage(props) {
  const {
    instagramToken,
    selectedImages,
    setSelectedImages,
    currentUser,
    setError,
    error,
    isEditing,
    updateSighting,
    setIsEditing,
    requiredMessage,
    setMapPin
  } = props;

  const [sightingDetails, setSightingDetails] = useState({
    lat: 52.610044,
    lng: -1.156774,
    datetime: "2020-01-01",
    photos: [],
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

  if (error) {
    return <div>{error.message}</div>;
  } else {
    return (
      <div>
        <Header loggedin="true" userName={props.userName} setInstagramToken={props.setInstagramToken}/>
        <div className="sighting-page">
          <Bird
            setError={setError}
            currentUser={currentUser}
            birdDetails={sightingDetails.bird}
          />
          <div className="sighting-container">
            {!isEditing ? ( //re-setting to not editing when leaving page
              <Sighting
                isEditing={props.isEditing}
                currentUser={currentUser}
                setError={setError}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                sightingID={sightingID}
                sightingDetails={sightingDetails}
                setSightingDetails={setSightingDetails}
                setMapPin={setMapPin}
                instagramToken={instagramToken}
                setIsEditing={setIsEditing}
                location="sightingPage"
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
                requiredMessage={requiredMessage}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
