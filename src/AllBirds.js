import React, { useState, useEffect } from "react";
import apiFetch from "./api";
import Family from "./Family.js";
import Header from "./Header.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./AllBirds.scss";

export default function AllBirds(props) {
  const { currentUser, setError } = props;

  const [birdData, setBirdData] = useState([]);
  const [displayingBirds, setDisplayingBirds] = useState({
    seen: true,
    unseen: true,
  });
  const [displayMenu, setDisplayMenu] = useState(false);

  useEffect(() => {
    async function fetchBirds() {
      const url = "/api/birds";

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

      try {
        res = await apiFetch(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          "Could not fetch bird list"
        );
      } catch (error) {
        console.error(error);
        setError(error);
        return;
      }

      const birds = await res.json();

      setBirdData(birds);
      console.log(birds);
    }
    fetchBirds();
  }, []);

  function toggleDisplayMenu() {
    setDisplayMenu(!displayMenu);
  }

  function toggleDisplayingBirds(event) {
    console.log(event.target.id, event.target.checked);
    if (event.target.id === "seen") {
      if (event.target.checked) {
        setDisplayingBirds({
          ...displayingBirds,
          seen: true,
        });
      } else {
        setDisplayingBirds({
          ...displayingBirds,
          seen: false,
        });
      }
    } else if (event.target.id === "unseen") {
      if (event.target.checked) {
        setDisplayingBirds({
          ...displayingBirds,
          unseen: true,
        });
      } else {
        setDisplayingBirds({
          ...displayingBirds,
          unseen: false,
        });
      }
    }
  }

  let filteredBirdData = birdData.filter(
    (bird) => 
      (displayingBirds.seen   && bird.sightings.length !== 0) ||
      (displayingBirds.unseen && bird.sightings.length === 0)
  );

  let categories = {};

  filteredBirdData.forEach((bird) => {
    if (!(bird.group.name in categories)) {
      categories[bird.group.name] = [bird];
    } else {
      categories[bird.group.name].push(bird);
    }
  });

  const birdList = Object.entries(categories).map((family, index) => {
    return <Family categoryData={family} key={index} className="category" />;
  });

  const categoryList = Object.entries(categories).map((family, index) => {
    return (
      <a key={index} href={`#${family[0]}`} onClick={() => toggleDisplayMenu()}>
        <li>{family[0]}</li>
      </a>
    );
  });

  return (
    <div className="all-birds">
      <Header loggedin="true"/>
      <div className="category-menu">
        <div className="scroller">
          <h3
            className="category-menu-header"
            onClick={() => toggleDisplayMenu()}
          >
            Categories and filters
            {!displayMenu ? (
              <FontAwesomeIcon
                icon={faAngleDown}
                className="down-arrow"
                alt="list of birds"
                size="2x"
              />
            ) : (
              <FontAwesomeIcon
                icon={faTimes}
                className="cross"
                alt="list of birds"
                size="2x"
              />
            )}
          </h3>
          {displayMenu && (
            <div>
              <div className="filters">
                <form>
                  <label htmlFor="seen">Birds I've seen</label>
                  <input
                    type="checkbox"
                    id="seen"
                    onChange={(event) => toggleDisplayingBirds(event)}
                    checked={displayingBirds.seen}
                  ></input>
                  <label htmlFor="unseen">Birds I've not seen</label>
                  <input
                    type="checkbox"
                    id="unseen"
                    onChange={(event) => toggleDisplayingBirds(event)}
                    checked={displayingBirds.unseen}
                  ></input>
                </form>
              </div>
              <ul className="category-list">{categoryList}</ul>
            </div>
          )}
        </div>
      </div>
      <ul className="bird-table">{birdList}</ul>
    </div>
  );
}
