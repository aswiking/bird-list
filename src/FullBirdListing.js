import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import apiFetch from "./api";
import "./FullBirdListing.scss";
import Photo from "./Photo.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import SightingForm from "./SightingForm";

const accessToken =
  "pk.eyJ1IjoiYXN3aWtpbmciLCJhIjoiY2tlY29pZTFrMGp6bzMzbXRyOGpqYW12eCJ9._TRyss_B8xuU2NnlHhyJng";

const Map = ReactMapboxGl({
  accessToken,
  doubleClickZoom: false,
});

const INITIAL_ZOOM = [15];

export default function FullBirdListing(props) {
  const {
    instagramToken,
    setSelectedImages,
    currentUser,
    setError,
    setMapPin,
    sightingDetails,
    setSightingDetails,
  } = props;

  const { sightingID } = useParams();

  useEffect(() => {
    async function fetchSighting() {
      let token;
      try {
        token = await currentUser.getIdToken();
      } catch (error) {
        console.error(error);
        setError({
          message: "Could not authorise",
        });
        return;
      }

      let res;

      const url = `/api/sightings/${sightingID}`;

      res = await apiFetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        "Could not fetch sighting details"
      );

      const sightingData = await res.json();

      setSightingDetails(sightingData);

      setSelectedImages(
        sightingData.photos.map((photo) => {
          return { instagram_media_id: photo.instagram_media_id };
        })
      );
      console.log(sightingData);
      setMapPin({ lat: sightingData.lat, lng: sightingData.lng });
    }
    fetchSighting();
  }, [setSelectedImages, sightingID, currentUser, setError, setMapPin]);

  function dateDifference() {
    const todaysDate = new Date();

    const millisecDiff = todaysDate - new Date(sightingDetails.datetime);
    // TODO: Display hours/days/weeks/months/years ago
    const daysAgo = Math.ceil(millisecDiff / (1000 * 60 * 60 * 24));
    return daysAgo;
  }
  const daysAgo = dateDifference();

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-GB", dateOptions);

  const sightingDate = dateTimeFormat.format(
    new Date(sightingDetails.datetime)
  );

  if (!props.isEditing) {
    return (
      <div className="full-bird-listing">
        <FontAwesomeIcon
          icon={faEdit}
          size="6x"
          className="edit-icon"
          onClick={() => props.setIsEditing(true)}
        />
        <div className="sighting-details">
          <h2>{daysAgo} days ago</h2>
          <h3>{sightingDate}</h3>
          <h3>Coordinates</h3>{" "}
          <p>
            {sightingDetails.lng}, {sightingDetails.lat}
          </p>
          <Map
            style="mapbox://styles/aswiking/ckeejcxsq0yr919ntrc8ll42l"
            center={[sightingDetails.lng, sightingDetails.lat]}
            zoom={INITIAL_ZOOM}
            containerStyle={{
              height: "400px",
              width: "400px",
            }}
          >
            <Marker coordinates={[props.mapPin.lng, props.mapPin.lat]}>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                size="6x"
                className="map-marker"
              />
            </Marker>
          </Map>
          <h3>Notes</h3>
          <p>{sightingDetails.notes}</p>
          <div className="photos">
            {sightingDetails.photos &&
              sightingDetails.photos.map((photo, index) => {
                return (
                  <Photo
                    key={index}
                    photoID={photo.photo_id}
                    instagramPhotoID={photo.instagram_media_id}
                    instagramToken={instagramToken}
                    sightingDetails={setSightingDetails}
                  />
                );
              })}
          </div>
        </div>
        <div className="bird-details">
          <h1>{sightingDetails.common}</h1>
          <h2 className="scientific">{sightingDetails.scientific}</h2>
          <h3>Family:</h3>
          <h4>{sightingDetails.group_common}</h4>
          <h4 className="scientific">{sightingDetails.group_scientific}</h4>
          <h3>UK status:</h3>
          <h4>{sightingDetails.uk_status}</h4>
        </div>
      </div>
    );
  } else {
    return (
      <SightingForm
        sighting={sightingDetails}
        formType="edit"
        instagramToken={instagramToken}
        selectedImages={props.selectedImages}
        setSelectedImages={props.setSelectedImages}
        submitSighting={props.submitSighting}
        placeMarker={props.placeMarker}
        mapPin={props.mapPin}
      />
    );
  }
}
