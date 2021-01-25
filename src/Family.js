import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./Family.scss";

export default function Family(props) {
  const familyName = props.categoryData[0];

  const speciesList = props.categoryData[1].map((bird, index) => {
    return (
      <div key={index} className="bird-entry">
         <div className="color-block"></div>
        <div className="link-container">
          <Link to={`/birds/${bird.id}`}>
            <div>
              {bird.sightings.length !== 0 && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="tickIcon"
                  alt="You have seen this bird"
                  size="1x"
                />
              )}
            </div>
            <div className="bird-details">
              <h3>{bird.common}</h3>
              <h4 className="scientific">{bird.scientific}</h4>
            </div>
          </Link>
        </div>
      </div>
    );
  });

  return (
    <div className="family">
      <h2 className="family-name" id={familyName}>
        {familyName}
      </h2>
      {speciesList}
    </div>
  );
}
