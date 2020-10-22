import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import Header from "./Header";
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
  const [mapCenter, setMapCenter] = useState({
    lat: 52.610044,
    lng: -1.156774,
  });

  const [instagramImages, setInstagramImages] = useState([]);

  function selectImage(imageID, permalink) {
    console.log("imageID", imageID);
    if (props.selectedImages.includes(imageID)) {
      props.setSelectedImages(
        props.selectedImages.filter((value) => {
          return value === imageID;
          //not working
        })
      );
    } else {
      props.setSelectedImages([
        ...props.selectedImages,
        { imageID, permalink },
      ]);
    }
  }

  const instagramToken = props.instagramToken;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setMapCenter(userLocation);
    });
  }, []);

  useEffect(() => {
    async function getImages() {
      let res;

      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type&access_token=${instagramToken}`;

      res = await apiFetch(url, {}, "Could not fetch images");

      const imageData = await res.json();
      setInstagramImages(imageData.data);
      console.log(imageData.data);
    }

    if (instagramToken) {
      getImages();
    }
  }, [instagramToken]);

  const imageList = instagramImages.map((image) => {
    return (
      <label for={image.id}>
        <img src={image.media_url} alt={image.caption} width="100px"></img>
        <input
          type="checkbox"
          value={image.id}
          onChange={() => selectImage(image.id, image.permalink)}
          checked={props.selectedImages[image.id]}
        ></input>
      </label>
    );
  });

  function updateCenter(map, event) {
    const newCenter = map.getCenter();
    setMapCenter({ lat: newCenter.lat, lng: newCenter.lng });
    console.log("Move");
  }

  return (
    <div className="sightingForm">
      <Header loggedin="true" />
      <div className="bodyBox">
        <h1>
          {" "}
          {useLocation().pathname === "/new-sighting"
            ? "New sighting"
            : props.sighting.common}
        </h1>
        <form onSubmit={(event) => props.submitSighting(event, props.sighting)}>
          <ul>
            {useLocation().pathname === "/new-sighting" && (
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
                defaultValue={props.sighting.date}
              ></input>
            </li>
            <div>
              <LocationDropDown
                accessToken={accessToken}
                setMapCenter={setMapCenter}
              />
              <Map
                style="mapbox://styles/aswiking/ckeejcxsq0yr919ntrc8ll42l"
                center={[mapCenter.lng, mapCenter.lat]}
                zoom={INITIAL_ZOOM}
                containerStyle={{
                  height: "800px",
                  width: "800px",
                }}
                onMoveEnd={(map, event) => updateCenter(map, event)}
                onDblClick={props.placeMarker}
              >
                {props.mapPin && (
                  <Marker coordinates={[props.mapPin.lng, props.mapPin.lat]}>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="mapMarker"
                    />
                  </Marker>
                )}
              </Map>
              <p>Double click to place a pin on the spot of your sighting</p>
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
                defaultValue={props.sighting.notes}
              ></textarea>
            </li>
          </ul>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

SightingForm.defaultProps = {
  sighting: {
    id: "",
    common: "",
    scientific: "",
    lat: "",
    lng: "",
    datetime: "",
    notes: "",
  },
};
