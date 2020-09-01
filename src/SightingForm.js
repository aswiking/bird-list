import React from "react";
import { useLocation } from "react-router-dom";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import Header from "./Header";
import BirdDropDown from "./BirdDropDown";
import "./SightingForm.scss";

export default function SightingForm(props) {
  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoiYXN3aWtpbmciLCJhIjoiY2tlY29pZTFrMGp6bzMzbXRyOGpqYW12eCJ9._TRyss_B8xuU2NnlHhyJng",
  });

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
                {/*<input type="text" id="common" list="birdnames" placeholder="Start typing to see options"></input>*/}
                <BirdDropDown currentUser={props.currentUser} />
              </li>
            )}
            <Map
              style="mapbox://styles/aswiking/ckeejcxsq0yr919ntrc8ll42l"
              containerStyle={{
                height: "200px",
                width: "200px",
              }}
            ></Map>
            {/* <li>
            <label htmlFor="scientific">Scentific name</label>{" "}
            <input
              id="scientific"
              type="text"
              defaultValue={props.sighting.scientific}
            ></input>
          </li> */}
            <li>
              <label htmlFor="latitude">Latitude</label>{" "}
              <input
                id="latitude"
                type="text"
                defaultValue={props.sighting.lat}
              ></input>
            </li>
            <li>
              <label htmlFor="longitude">Longitude</label>{" "}
              <input
                id="longitude"
                type="text"
                defaultValue={props.sighting.lng}
              ></input>
            </li>
            <li>
              <label htmlFor="date">Date seen</label>{" "}
              <input
                id="date"
                type="date"
                defaultValue={props.sighting.datetime}
              ></input>
            </li>
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
