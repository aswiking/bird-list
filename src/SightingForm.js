import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import BirdDropDown from "./BirdDropDown";
import "./SightingForm.scss";
import LocationDropDown from "./LocationDropDown";
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
    setSelectedBird,
    setIsEditing,
    placeMarker,
    mapPin,
    setMapPin,
    requiredMessage,
  } = props;

  const [mapCenter, setMapCenter] = useState({
    lat: 52.610044,
    lng: -1.156774,
  });

  const [instagramImages, setInstagramImages] = useState([]);
  const [instagramError, setInstagramError] = useState(null);

  

  const dateOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-CA", dateOptions);

  const today = dateTimeFormat.format(new Date());


  useEffect(() => {
    if (props.formType === "new") {
      setMapPin({});
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
  }, [props.formType, sightingDetails.lat, sightingDetails.lng]);

  useEffect(() => {
    async function getImages() {
      let res;

      try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type&access_token=${instagramToken}`;

        res = await apiFetch(
          url,
          {},
          "Failed to load Instagram feed. Try logging out and in again."
        );
      } catch (instagramError) {
        setInstagramError(instagramError);
        return;
      }

      const imageData = await res.json();

      console.log('imageData', imageData)

      const filteredImageData = imageData.data.filter((image) => image.media_type !== 'VIDEO')

      setInstagramImages(filteredImageData);
    }

    if (instagramToken) {
      console.log("images", instagramImages);
      getImages();
    }
  }, [instagramToken]);

  const { id, common } = useParams();
  console.log("id and common are", id, common);
  if (id) {
    setSelectedBird(id);
  }

  function selectImage(imageId) {
    console.log("imageID", typeof imageId, typeof props.selectedImages[0]);

    if (
      //if there is an item in the selectedImages array that matches the ID
      props.selectedImages.filter((selectedImage) => selectedImage === imageId)
        .length > 0
    ) {
      props.setSelectedImages(
        //then remove that item from the array
        props.selectedImages.filter(
          (selectedImage) => selectedImage !== imageId
        )
      );
    } else {
      //otherwise add the item to the array
      props.setSelectedImages([...props.selectedImages, imageId]);
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
              (selectedImage) => selectedImage === image.id
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

  let photosContent;

  if (!instagramToken) {
    photosContent = (
      <div className="instagram-link">
        <a
          href={`https://api.instagram.com/oauth/authorize?client_id=1440877326102459&redirect_uri=https://localhost:3000/&scope=user_profile,user_media&response_type=code`}
        >
          Link your account to Instagram to select photos
        </a>
      </div>
    );
  } else if (instagramToken && instagramError) {
    photosContent = (
      <div className="error-message">
        <p>{instagramError.message}</p>
      </div>
    );
  } else {
    photosContent = <div className="images">{imageList}</div>;
  }

  return (
    <div>
      <div className="sightingForm">
        {props.formType === "new" && <h1>New sighting</h1>}
        <form onSubmit={(event) => submitSighting(event, sightingDetails)}>
          {props.formType === "edit" && <h2>Editing sighting</h2>}
          <ul>
            {props.formType === "new" && (
              <li
                className={`species ${
                  requiredMessage.field === "species" ? "highlight" : ""
                }`}
              >
                <h3>
                  <label htmlFor="species">Species *</label>
                </h3>
                <BirdDropDown
                  currentUser={props.currentUser}
                  selectSpecies={props.selectSpecies}
                  defaultValue={id}
                  defaultLabel={common}
                />
              </li>
            )}
            <li
              className={`date ${
                requiredMessage.field === "date" ? "highlight" : ""
              }`}
            >
              <h3>
                <label htmlFor="date">Date seen *</label>
              </h3>
              <input
                id="date"
                type="date"
                max={today}
                min="1899-01-01"
                defaultValue={
                  
                  sightingDetails.datetime ?
                  (sightingDetails.datetime.substring(0, 10)) :
                  today


                }
              ></input>
            </li>
            <div className="location-select-section">
              <h3>Location</h3>
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
            {/* instagram content
            <div className="images-container">
              <h3>Photos</h3>
              <div>{photosContent}</div>
            </div>
            */}
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
          <button className="hover-pointer">Submit</button>
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
