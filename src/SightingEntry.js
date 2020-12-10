import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SightingsEntry.scss";

export default function SightingEntry(props) {
  const [imageDetails, setImageDetails] = useState(null);

  useEffect(() => {
    if (props.sighting.photos) {
      async function getImageUrl() {
        let res;
        res = await fetch(
          `https://graph.instagram.com/${props.sighting.photos[0].instagram_media_id}?fields=caption,media_url&access_token=${props.instagramToken}`
        );

        const variable = await res.json();

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

  function setStateID() {
    console.log(props.sighting.id)
    
  }

  return (
    <Link
      to={`/sightings/${props.sighting.id}`}
      onClick={setStateID}
      className="sightingEntry"
      key={props.sighting.id}
    >
      <div className="entryDetails">
        <div className="name">
          <h2 className="birdName">{props.sighting.common}</h2>
          <h3 className="scientific">{props.sighting.scientific}</h3>
        </div>
        <h4>Last seen {daysAgo} days ago</h4>
      </div>
      {imageDetails && (
        <div className="entryphoto-div">
          <div className="colorblock"></div>
        <img
          src={imageDetails.media_url}
          alt={imageDetails.caption}
          className="entryPhoto"
        ></img>
        </div>
      )}

      {/*  

          <div className="buttons">
            <button onClick={(event) => props.setEditing(event, props.sighting.id)}>
              Edit
            </button>
            <button onClick={(event) => props.deleteBird(event, props.sighting.id)}>
              Delete
            </button>
          </div>
          */}
    </Link>
  );
}
