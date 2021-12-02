import React, { useEffect, useState } from "react";
import apiFetch from "./api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import "./Bird.scss";

export default function Bird(props) {
  const [displayBirdDetails, setDisplayBirdDetails] = useState(false);

  const { currentUser, setError, birdDetails, setBirdDetails, birdID } = props;

  /*let url;
  if(window.location.host === 'www.aswiking.com') {
    url = "/fledgling/api/birds"
  } else {
    url = "/api/birds"
  }*/

  const url = "/api/birds";

  useEffect(() => {
    if (!props.birdID) {
      return;
    }
    async function fetchBird() {
      let token;
      try {
        token = await currentUser.getIdToken();
      } catch (error) {
        console.error(error);
        setError({
          message: "Could not authorise",
        });
        return;
      }

      let res;

      const fetchUrl = `${url}/${birdID}`;

      try {
        res = await apiFetch(
          fetchUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          "Could not fetch bird details"
        );
      } catch (error) {
        setError(error);
        return;
      }

      const birdData = await res.json();

      setBirdDetails(birdData);
    }
    fetchBird();
  }, [currentUser, setError, birdID, props.birdID, setBirdDetails]);

  function toggleDisplayBirdDetails() {
    setDisplayBirdDetails(!displayBirdDetails);
  }

  return (
    <div>
      <div className="bird-details">
        <div
          className="bird-details-header"
          onClick={() => toggleDisplayBirdDetails()}
        >
          <div>
            <h2>{birdDetails.common}</h2>
            <h4 className="scientific">{birdDetails.scientific}</h4>
          </div>
          {!displayBirdDetails ? (
            <FontAwesomeIcon
              icon={faAngleDown}
              className="toggle-details down-arrow hover-pointer"
              alt="down arrow"
              size="2x"
            />
          ) : (
            <FontAwesomeIcon
              icon={faAngleUp}
              className="toggle-details cross hover-pointer"
              alt="up-arrow"
              size="2x"
            />
          )}
        </div>
        <div className="full-details-container">
          <div
            className={`full-details ${
              displayBirdDetails ? "active" : "inactive"
            }`}
          >
            <h3>Family:</h3>
            <h4>{birdDetails.group.common}</h4>
            <h4 className="scientific">{birdDetails.group.scientific}</h4>
            <h3>UK status:</h3>
            <h4>{birdDetails.uk_status}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
