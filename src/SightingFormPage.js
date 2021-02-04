import React from "react";
import Header from "./Header.js";
import SightingForm from "./SightingForm.js";
import './SightingFormPage.scss';

export default function SightingFormPage(props) {
  const {
    addSighting,
    placeMarker,
    mapPin,
    selectSpecies,
    selectedImages,
    setSelectedImages,
    requiredMessage,
  } = props;

  return (
    <div className="sighting-form-page">
      <Header loggedin="true" />
      <div className="sightingform-container">
      <SightingForm
        currentUser={props.currentUser}
        submitSighting={addSighting}
        placeMarker={placeMarker}
        mapPin={mapPin}
        selectSpecies={selectSpecies}
        instagramUid={props.instagramUid}
        instagramToken={props.instagramToken}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        formType="new"
        requiredMessage={requiredMessage}
      />
    </div></div>
  );
}
