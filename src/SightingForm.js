import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import BirdDropDown from "./BirdDropDown";
import "./SightingForm.scss";
import LocationDropDown from "./LocationDropDown";
import apiFetch from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const accessToken =
  "pk.eyJ1IjoiYXN3aWtpbmciLCJhIjoiY2tlY29pZTFrMGp6bzMzbXRyOGpqYW12eCJ9._TRyss_B8xuU2NnlHhyJng";

const Map = ReactMapboxGl({
  accessToken,
  doubleClickZoom: false,
});

const INITIAL_ZOOM = [15];

export default function SightingForm(props) {
  const { instagramToken, deleteSighting, submitSighting, sightingDetails, setIsEditing } = props;

  const [mapCenter, setMapCenter] = useState({
    lat: 52.610044,
    lng: -1.156774,
  });
  const [instagramImages, setInstagramImages] = useState([]);

  useEffect(() => {
    if (props.formType === "new") {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(userLocation);
      });
    } else {
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

  const imageList = instagramImages.map((image) => {
    return (
      <div className="image-div">
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
        <label for={image.id}>
          <img src={image.media_url} alt={image.caption} ></img>
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
    <div className="sightingForm">
        <h1> {props.formType === "new" ? "New sighting" : sightingDetails.common}</h1>
        <form onSubmit={(event) => submitSighting(event, sightingDetails)}>
          <ul>
            {props.formType === "new" && (
              <li>
                <label htmlFor="species">Species</label>{" "}
                <BirdDropDown
                  currentUser={props.currentUser}
                  selectSpecies={props.selectSpecies}
                />
              </li>
            )}
            <li>
              <label htmlFor="date">Date seen</label>{" "}
              <input
                id="date"
                type="date"
                defaultValue={sightingDetails.datetime.substring(0, 10)}
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
                  width: "calc(100vw - 40px)"
                }}
                onMoveEnd={(map, event) => updateCenter(map, event)}
                onDblClick={props.placeMarker}
              >
                {props.mapPin && (
                  <Marker coordinates={[props.mapPin.lng, props.mapPin.lat]}>
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
            {instagramToken ? (
              <div className="images">{imageList}</div>
            ) : (
              <a
                href={`https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://localhost:3000/&scope=user_profile,user_media&response_type=code`}
              >
                Link your account to Instagram to select photos
              </a>
            )}
            <li className="notes">
              <label htmlFor="notes">Notes</label>{" "}
              <textarea
                rows="8"
                id="notes"
                type="text"
                defaultValue={sightingDetails.notes}
              ></textarea>
            </li>
          </ul>
          <button>Submit</button>
        </form>
        <div className="option-container">
        <div onClick={(event) => setIsEditing(false)}>
          <p>Discard changes</p>
        </div>
        <div onClick={(event) => deleteSighting(event, sightingDetails.id)}>
          <p>Delete sighting</p>
        </div>
        </div>
    </div>
  );
}

/*
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
}; */
