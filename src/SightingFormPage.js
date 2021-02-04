import React from "react";
import Header from "./Header.js";
import SightingForm from "./SightingForm.js";

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
    <div>
      <Header loggedin="true" />
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
    </div>
  );
}
