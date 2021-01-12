import React, { useEffect, useState } from "react";
import apiFetch from "./api.js";
import Photo from "./Photo.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";

const accessToken =
  "pk.eyJ1IjoiYXN3aWtpbmciLCJhIjoiY2tlY29pZTFrMGp6bzMzbXRyOGpqYW12eCJ9._TRyss_B8xuU2NnlHhyJng";

const Map = ReactMapboxGl({
  accessToken,
  doubleClickZoom: false,
});

const INITIAL_ZOOM = [15];

export default function Sighting(props) {
  const {
    currentUser,
    sightingDetails,
    setSightingDetails,
    instagramToken,
    setIsEditing,
    sightingID,
    setError,
  } = props;

  useEffect(() => {
    if (!sightingID) {
      return;
    }

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
      try {
        res = await apiFetch(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          "Could not fetch sighting details"
        );
      } catch (error) {
        setError(error);
        return;
      }

      const sightingData = await res.json();

      setSightingDetails(sightingData);
    }

    fetchSighting();
  }, [sightingID, currentUser, setError]);

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

  return (
    <div className="sighting">
      <div className="sighting-details">
        <FontAwesomeIcon
          icon={faEdit}
          size="2x"
          className="edit-icon"
          onClick={() => setIsEditing(true)}
        />
        <h3>{sightingDate}</h3>
        <h4>Location</h4>
        <div className="map-container">
          <Map
            style="mapbox://styles/aswiking/ckeejcxsq0yr919ntrc8ll42l"
            center={[sightingDetails.lng, sightingDetails.lat]}
            zoom={INITIAL_ZOOM}
            containerStyle={{
              height: "400px",
              width: "calc(100vw - 40px)",
            }}
          >
            <Marker coordinates={[sightingDetails.lng, sightingDetails.lat]}>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                size="6x"
                className="map-marker"
              />
            </Marker>
          </Map>
        </div>
        <p>
          Coordinates: {sightingDetails.lng}, {sightingDetails.lat}
        </p>
        <h4>Notes</h4>
        <div className="note-box">
          <p>{sightingDetails.notes}</p>
        </div>
        <h4>Photos</h4>
        <div className="photos">
          {sightingDetails.photos &&
            sightingDetails.photos.map((photo, index) => {
              return (
                <Photo
                  key={index}
                  photoID={photo.photo_id}
                  instagramPhotoID={photo.instagram_media_id}
                  instagramToken={instagramToken}
                  sightingDetails={sightingDetails}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
