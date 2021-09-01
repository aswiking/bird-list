import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomePageCardText from "./HomePageCardText.js";
import BirdPageCardText from "./BirdPageCardText.js";
import './Card.scss';

export default function Card(props) {
  const { sighting, index, instagramToken, page, numberOfSightings } = props;

  const [imageDetails, setImageDetails] = useState(null);

  useEffect(() => {
    if (props.sighting.photos.length !== 0) {
      async function getImageUrl() {
        let res;
        res = await fetch(
          `https://graph.instagram.com/${sighting.photos[0].instagram_media_id}?fields=caption,media_url&access_token=${instagramToken}`
        );

        const variable = await res.json();

        setImageDetails(variable);
      }
      getImageUrl();
    }
  }, [instagramToken, props.sighting.photos.length, sighting.photos]);

  return (
    <div className="card">
      <Link
        to={`/sightings/${sighting.id}`}
        className="sighting-entry"
        key={sighting.id}
      >
        <div className="link-container">
          {page === "birdpage" ? (
            <BirdPageCardText
              numberOfSightings={numberOfSightings}
              sighting={sighting}
              index={index}
            />
          ) : (
            <HomePageCardText sighting={sighting} />
          )}
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
        </div>
      </Link>
    </div>
  );
}
