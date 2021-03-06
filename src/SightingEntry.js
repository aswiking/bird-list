import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SightingsEntry.scss";

export default function SightingEntry(props) {
  const [imageDetails, setImageDetails] = useState(null);

  useEffect(() => {
    if (props.sighting.photos.length !== 0) {
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
    const daysAgo = (Math.ceil(millisecDiff / (1000 * 60 * 60 * 24))- 1);
    let timeAgo;

    if ((daysAgo / 365) >= 2 ) {
      timeAgo = `${(Math.floor(daysAgo / 365))} years ago`;
    } else if ((daysAgo / 365) >= 1) {
      timeAgo = `${(Math.floor(daysAgo / 365))} year ago`;
    } else if ((daysAgo / 30) >= 2) {
      timeAgo = `${(Math.floor(daysAgo / 30))} months ago`;
    } else if ((daysAgo / 30) >= 1) {
      timeAgo = `${(Math.floor(daysAgo / 30))} month ago`;
    } else if ((daysAgo / 7) >= 2) {
      timeAgo = `${(Math.floor(daysAgo / 7))} weeks ago`;
    } else if ((daysAgo / 7) >= 1) {
      timeAgo = `${(Math.floor(daysAgo / 7))} week ago`;
    } else if (daysAgo >= 2) {
      timeAgo = `${(Math.floor(daysAgo))} days ago`;
    } else if (daysAgo === 1) {
      timeAgo = `${(Math.floor(daysAgo))} day ago`;
    } else {
      timeAgo = `${daysAgo} days ago`;
    }
    return timeAgo;
  }

  const timeAgo = dateDifference();

  return (
    <Link
      to={`/sightings/${props.sighting.id}`}
      className="sightingEntry"
      key={props.sighting.id}
    >
      <div className="entryDetails">
        <div className="name">
          <h2 className="birdName">{props.sighting.bird.common}</h2>
          <h3 className="scientific">{props.sighting.bird.scientific}</h3>
        </div>
        <h4>Last seen {timeAgo}</h4>
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
