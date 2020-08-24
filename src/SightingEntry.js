import React from "react";


export default function SightingEntry (props){
return <div className="sightingEntry" key={props.sighting.id}>
          <h2 className="birdName">{props.sighting.common}</h2>
          <h3>{props.sighting.scientific}</h3>
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
        </div>}