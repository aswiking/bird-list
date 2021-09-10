import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header.js";
import SightingForm from "./SightingForm.js";
import './SightingFormPage.scss';

export default function SightingFormPage(props) {
  const {
    submitSighting,
    placeMarker,
    mapPin,
    setMapPin,
    selectSpecies,
    setSelectedBird,
    selectedImages,
    setSelectedImages,
    requiredMessage,
    setRequiredMessage
  } = props;

  const { birdID, commonName } = useParams();

  useEffect(() => {
    setRequiredMessage({
      field: null,
      message: null});
  }, [])

  return (
    <div className="sighting-form-page">
      <Header loggedin="true" userName={props.userName} setInstagramToken={props.setInstagramToken}/>
      <div className="sightingform-container">
      <SightingForm
        currentUser={props.currentUser}
        submitSighting={submitSighting}
        placeMarker={placeMarker}
        mapPin={mapPin}
        setMapPin={setMapPin}
        selectSpecies={selectSpecies}
        setSelectedBird={setSelectedBird}
        instagramUid={props.instagramUid}
        instagramToken={props.instagramToken}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        formType="new"
        requiredMessage={requiredMessage}
        providedSpecies={birdID}
        commonName={commonName}
      />
    </div></div>
  );
}
