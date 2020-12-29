import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import apiFetch from './api.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Bird(props) {

  const [displayBirdDetails, setDisplayBirdDetails] = useState(false);


  const { currentUser, setError, birdID } = props;


  const [birdDetails, setBirdDetails] = useState({})

  useEffect(() => {
    if (!birdID) {
      return;
    }
    async function fetchBird() {
      let token;
      try {
        token = await currentUser.getIdToken()
      } catch (error) {
        console.error(error);
        setError({
          message: 'Could not authorise'
        });
        return;
      }

      let res;

      const url = `/api/birds/${birdID}`;

      res = await apiFetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        "Could not fetch bird details"
      );

      const birdData = await res.json();

      setBirdDetails(birdData);
    }
    fetchBird();
  }, [currentUser, setError, birdID]
  )

  console.log(birdDetails)

  function toggleDisplayBirdDetails() {
    setDisplayBirdDetails(!displayBirdDetails);
  }

return <div>
          <div className="bird-details">
          <div
            className="bird-details-header"
            onClick={() => toggleDisplayBirdDetails()}
          >
            <div>
            <h3>{birdDetails.common}</h3>
            <h4 className="scientific">{birdDetails.scientific}</h4>
            </div>
            {!displayBirdDetails ? (
              <FontAwesomeIcon
                icon={faAngleDown}
                className="toggle-details down-arrow"
                alt="down arrow"
                size="2x"
              />
            ) : (
              <FontAwesomeIcon
                icon={faTimes}
                className="toggle-details cross"
                alt="cross"
                size="2x"
              />
            )}
          </div>
          {displayBirdDetails && (
            <div className="full-details">
              <h3>Family:</h3>
              <h4>{birdDetails.group.common}</h4>
              <h4 className="scientific">{birdDetails.group.scientific}</h4>
              <h3>UK status:</h3>
              <h4>{birdDetails.uk_status}</h4>
            </div>
          )}
        </div>
</div>
}