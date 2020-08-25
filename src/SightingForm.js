import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

export default function SightingForm(props) {
  console.log("params is", useLocation().pathname);
  return (
    <div>
      <Header loggedin="true"/>
      <div>
        <h2>
          {" "}
          {useLocation().pathname === "/new-sighting"
            ? "New sighting"
            : props.sighting.common}
        </h2>
        <form onSubmit={(event) => props.submitSighting(event, props.sighting)}>
          <ul>
            {useLocation().pathname === "/new-sighting" && (
              <li>
                <label htmlFor="name">Name</label>{" "}
                <input type="text" id="name"></input>
              </li>
            )}
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
            <li>
              <label htmlFor="notes">Notes</label>{" "}
              <input
                id="notes"
                type="text"
                defaultValue={props.sighting.notes}
              ></input>
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
