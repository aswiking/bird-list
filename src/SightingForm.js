import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import Header from "./Header";
import BirdDropDown from "./BirdDropDown";
import "./SightingForm.scss";
import LocationDropDown from "./LocationDropDown";

export default function SightingForm(props) {
  const [mapCenter, setMapCenter] = useState({ lat: 52.602567, lng: -1.122065 });

  const accessToken =
    "pk.eyJ1IjoiYXN3aWtpbmciLCJhIjoiY2tlY29pZTFrMGp6bzMzbXRyOGpqYW12eCJ9._TRyss_B8xuU2NnlHhyJng";
  const Map = ReactMapboxGl({
    accessToken,
     
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
                <BirdDropDown currentUser={props.currentUser} />
              </li>
            )}
            <div>
              <LocationDropDown accessToken={accessToken} setMapCenter={setMapCenter}/>
              <Map
                style="mapbox://styles/aswiking/ckeejcxsq0yr919ntrc8ll42l"
                center={[mapCenter.lng, mapCenter.lat]}
                zoom={[15]}
                containerStyle={{
                  height: "800px",
                  width: "800px",
                }}
              ></Map>
            </div>
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
