import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "./api";
import "./FullBirdListing.scss";
import Photo from "./Photo.js";

export default function FullBirdListing(props) {
  const { instagramToken } = props;
  const [sightingDetails, setSightingDetails] = useState({});
  const { sightingID } = useParams();

  useEffect(() => {
    async function fetchSighting() {
      let token;
      try {
        token = await props.currentUser.getIdToken();
      } catch (error) {
        console.error(error);
        props.setError({
          message: "Could not authorise",
        });
        return;
      }

      let res;

      const url = `/api/sightings/${sightingID}`;

      res = await apiFetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        "Could not fetch sighting details"
      );

      const sightingData = await res.json();

      setSightingDetails(sightingData);
    }
    fetchSighting();
  }, [props, sightingID]);

  function dateDifference() {
    const todaysDate = new Date();

    const millisecDiff = todaysDate - new Date(sightingDetails.datetime);
    // TODO: Display hours/days/weeks/months/years ago
    const daysAgo = Math.ceil(millisecDiff / (1000 * 60 * 60 * 24));
    return daysAgo;
  }
  const daysAgo = dateDifference();

  return (
    <div className="full-bird-listing">
      <div className="sighting-details">
        <h1>My sightings</h1>
        <h2>{daysAgo} days ago</h2>
        <h3>{sightingDetails.datetime}</h3>
        <h3>Coordinates</h3>{" "}
        <p>
          {sightingDetails.lng}, {sightingDetails.lat}
        </p>
        <h3>Notes</h3>
        <p>{sightingDetails.notes}</p>
        <div className="photos">
          {sightingDetails.photos &&
            sightingDetails.photos.map((photo, index) => {
              return (
                <Photo
                  key={index}
                  photoID={photo.photo_id}
                  instagramPhotoID={photo.instagram_media_id}
                  instagramToken={instagramToken}
                />
              );
            })}
        </div>
      </div>
      <div className="bird-details">
        <h1>{sightingDetails.common}</h1>
        <h2 className="scientific">{sightingDetails.scientific}</h2>
        <h3>Family:</h3>
        <h4>{sightingDetails.group_common}</h4>
        <h4>{sightingDetails.group_scientific}</h4>
        <h3>UK status:</h3>
        <h4>{sightingDetails.uk_status}</h4>
      </div>
    </div>
  );
}
