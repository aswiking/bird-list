import React from "react";
import "./SightingsEntry.scss";

export default function SightingEntry(props) {
  function dateDifference() {
    const todaysDate = new Date();

    const millisecDiff = todaysDate - new Date(props.sighting.datetime);
    // TODO: Display hours/days/weeks/months/years ago
    const daysAgo = Math.ceil(millisecDiff / (1000 * 60 * 60 * 24));

    console.log(todaysDate, props.sighting.datetime);

    return daysAgo;
  }

  const daysAgo = dateDifference();

  return (
    <div className="sightingEntry" key={props.sighting.id}>
      <div className="name">
        <h2 className="birdName">{props.sighting.common}</h2>
        <h3>{props.sighting.scientific}</h3>
      </div>
      <h4>Last seen {daysAgo} days ago</h4>
      {/*  
          <ul>
            <li >
              <p className="label">Place seen: </p>
              {props.sighting.lat}
              {props.sighting.lng}
            </li>
            <li >
              <p className="label">Date seen: </p>
              {new Date(props.sighting.datetime).toLocaleDateString()}
            </li>
            <li >
              <p className="notes">Notes: </p>
              {props.sighting.notes}
            </li>
          </ul>
          <div className="buttons">
            <button onClick={(event) => props.setEditing(event, props.sighting.id)}>
              Edit
            </button>
            <button onClick={(event) => props.deleteBird(event, props.sighting.id)}>
              Delete
            </button>
          </div>
          */}
    </div>
  );
}
