import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import BirdDropDown from "./BirdDropDown";
import "./SightingForm.scss";
import LocationDropDown from "./LocationDropDown";
import Header from "./Header.js";
import apiFetch from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const accessToken =
  "pk.eyJ1IjoiYXN3aWtpbmciLCJhIjoiY2tlY29pZTFrMGp6bzMzbXRyOGpqYW12eCJ9._TRyss_B8xuU2NnlHhyJng";

const Map = ReactMapboxGl({
  accessToken,
  doubleClickZoom: false,
});

const INITIAL_ZOOM = [15];

export default function SightingForm(props) {
  const {
    instagramToken,
    deleteSighting,
    submitSighting,
    sightingDetails,
    setIsEditing,
    placeMarker,
    mapPin,
    requiredMessage,
  } = props;

  const [mapCenter, setMapCenter] = useState({
    lat: 52.610044,
    lng: -1.156774,
  });
  const [instagramImages, setInstagramImages] = useState([]);

  const dateOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-CA", dateOptions);

  const today = dateTimeFormat.format(
    new Date()
  );


  useEffect(() => {
    if (props.formType === "new") {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(userLocation);
      });
    } else if (sightingDetails.lat) {
      setMapCenter({
        lat: sightingDetails.lat,
        lng: sightingDetails.lng,
      });
    }
  }, []);

  useEffect(() => {
    async function getImages() {
      let res;

      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type&access_token=${instagramToken}`;

      res = await apiFetch(url, {}, "Could not fetch images");

      const imageData = await res.json();
      setInstagramImages(imageData.data);
      console.log(imageData.data);
    }

    if (instagramToken) {
      console.log("images", instagramImages);
      getImages();
    }
  }, [instagramToken, sightingDetails]);

  function selectImage(instagramImageID) {
    console.log("imageID", instagramImageID);
    if (
      props.selectedImages.filter(
        (selectedImage) => selectedImage.instagram_media_id === instagramImageID
      ).length > 0
    ) {
      props.setSelectedImages(
        props.selectedImages.filter(
          (selectedImage) =>
            selectedImage.instagram_media_id !== instagramImageID
        )
      );
    } else {
      props.setSelectedImages([
        ...props.selectedImages,
        { instagram_media_id: instagramImageID },
      ]);
    }
  }

  const imageList = instagramImages.map((image, index) => {
    return (
      <div className="image-div" key={index}>
        <input
          type="checkbox"
          id={image.id}
          value={image.id}
          onChange={() => selectImage(image.id)}
          checked={
            props.selectedImages.findIndex(
              (selectedImage) => selectedImage.instagram_media_id === image.id
            ) !== -1
          }
        ></input>
        <div className="color-outline"></div>
        <label htmlFor={image.id}>
          <img src={image.media_url} alt={image.caption}></img>
        </label>
      </div>
    );
  });

  function updateCenter(map, event) {
    const newCenter = map.getCenter();
    setMapCenter({ lat: newCenter.lat, lng: newCenter.lng });
    console.log("Move");
  }

  return (
    <div>
      {props.formType === "new" && <Header loggedin="true" />}
      <div className="sightingForm">
        {props.formType === "new" && <h1>New sighting</h1>}
        <form onSubmit={(event) => submitSighting(event, sightingDetails)}>
          <ul>
            {props.formType === "new" && (
              <li
                className={
                  requiredMessage.field === "species" ? "highlight" : undefined
                }
              >
                <h3>
                  <label htmlFor="species">Species *</label>
                </h3>
                <BirdDropDown
                  currentUser={props.currentUser}
                  selectSpecies={props.selectSpecies}
                />
              </li>
            )}
            <li
              className={
                requiredMessage.field === "date" ? "highlight" : undefined
              }
            >
              <h3>
                <label htmlFor="date">Date seen *</label>
              </h3>
              <input
                id="date"
                type="date"
                max={today}
                min='1899-01-01'
                defaultValue={
                  sightingDetails.datetime &&
                  sightingDetails.datetime.substring(0, 10)
                }
              ></input>
            </li>
            <div className="location-select-section">
              <LocationDropDown
                accessToken={accessToken}
                setMapCenter={setMapCenter}
              />
              <div className="map-container">
                <Map
                  style="mapbox://styles/aswiking/ckeejcxsq0yr919ntrc8ll42l"
                  center={[mapCenter.lng, mapCenter.lat]}
                  zoom={INITIAL_ZOOM}
                  containerStyle={{
                    height: "400px",
                    width: "calc(100vw - 40px)",
                  }}
                  onMoveEnd={(map, event) => updateCenter(map, event)}
                  onDblClick={(map, event) => placeMarker(map, event)}
                  // ^ working - just not in devtools with toggle device bar
                >
                  {mapPin.lng && (
                    <Marker coordinates={[mapPin.lng, mapPin.lat]}>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="map-marker"
                        size="6x"
                      />
                    </Marker>
                  )}
                </Map>
              </div>
              <p className="pin-instructions">
                Double click to place a pin on the spot of your sighting
              </p>
            </div>
            <div className="images-container">
              <h3>Photos</h3>
              {instagramToken ? (
                <div className="images">{imageList}</div>
              ) : (
                <div className="instagram-link">
                  <a
                    href={`https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://localhost:3000/&scope=user_profile,user_media&response_type=code`}
                  >
                    Link your account to Instagram to select photos
                  </a>
                </div>
              )}
            </div>
            <li className="notes">
              <h3>
                <label htmlFor="notes">Notes</label>
              </h3>
              <textarea
                rows="8"
                id="notes"
                type="text"
                defaultValue={sightingDetails.notes}
              ></textarea>
            </li>
          </ul>
          {requiredMessage.field && (
            <div className="required-message">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="exclamation-icon"
                size="2x"
              ></FontAwesomeIcon>
              <p>{requiredMessage.message}</p>
            </div>
          )}
          <button>Submit</button>
        </form>
        {props.formType !== "new" && (
          <div className="option-container">
            <div onClick={(event) => setIsEditing(false)}>
              <p>Discard changes</p>
            </div>
            <div onClick={(event) => deleteSighting(event, sightingDetails.id)}>
              <p>Delete sighting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

SightingForm.defaultProps = {
  sightingDetails: {
    id: "",
    common: "",
    scientific: "",
    lat: "",
    lng: "",
    datetime: "",
    notes: "",
  },
};
