import React, { useEffect, useState } from "react";
import "./SightingsEntry.scss";

export default function SightingEntry(props) {
  const [imageDetails, setImageDetails] = useState(null);

  useEffect(() => {
    if (props.sighting.instagram_media_id) {
      async function getImageUrl() {
        let res;
        res = await fetch(
          `https://graph.instagram.com/${props.sighting.instagram_media_id}?fields=caption,media_url&access_token=${props.instagramToken}`
        ); //instagram thinks id doesn't exist

        const variable = await res.json();

        console.log(props.sighting.instagram_media_id);

        setImageDetails(variable);
      }
      getImageUrl();
    }
  }, []);

  function dateDifference() {
    const todaysDate = new Date();

    const millisecDiff = todaysDate - new Date(props.sighting.datetime);
    // TODO: Display hours/days/weeks/months/years ago
    const daysAgo = Math.ceil(millisecDiff / (1000 * 60 * 60 * 24));
    return daysAgo;
  }

  const daysAgo = dateDifference();

  return (
    <div className="sightingEntry" key={props.sighting.id}>
      <div className="entryDetails">
        <div className="name">
          <h2 className="birdName">{props.sighting.common}</h2>
          <h3>{props.sighting.scientific}</h3>
        </div>
        <h4>Last seen {daysAgo} days ago</h4>
      </div>
      {imageDetails && (
        <img src={imageDetails.media_url} alt={imageDetails.caption} className="entryPhoto"></img>
      )}

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
