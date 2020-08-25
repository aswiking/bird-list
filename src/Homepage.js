import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import "./HomePage.scss";
import "./SightingsEntry.scss";
import Header from "./Header.js";
import SightingForm from "./SightingForm";
import SightingEntry from "./SightingEntry";
import apiFetch from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function HomePage(props) {
  const [sightingsData, setSightings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSightings() {
      let token;
      try {
        token = await props.currentUser.getIdToken();
      } catch (error) {
        console.error(error);
        setError({
          message: "Could not authorise",
        });
        return;
      }

      let res;
      res = await apiFetch(
        "/api/sightings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        "Could not fetch sightings"
      );
      const sightings = await res.json();
      setSightings(sightings);
      console.log(sightings);
    }
    fetchSightings();
  }, []);

  async function addSighting(event) {
    event.preventDefault();
    console.log(event.target);
    const newSighting = {
      common: event.target.common.value,
      scientific: event.target.scientific.value,
      datetime: event.target.datetime.value,
      lat: event.target.lat.value,
      lng: event.target.lng.value,
      notes: event.target.notes.value,
    };
    event.target.reset();

    const url = "/api/sightings";

    let res;
    try {
      res = await apiFetch(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSighting),
        },
        "Could not add sighting"
      );
    } catch (error) {
      console.error(error);
      setError(error);
      return;
    }

    const sighting = await res.json();

    setSightings([...sightingsData, sighting]);
  }

  async function updateSighting(event, originalSighting) {
    event.preventDefault();
    console.log(event.target);

    const updatedSighting = {
      id: originalSighting.id,
      common: originalSighting.common,
      scientific: originalSighting.scientific,
      datetime: event.target.datetime.value,
      lat: event.target.lat.value,
      lng: event.target.lng.value,
      notes: event.target.notes.value,
    };
    console.log(originalSighting);

    const url = `/api/sightings/${originalSighting.id}`;

    let res;
    try {
      res = await apiFetch(
        url,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSighting),
        },
        "Could not update sighting"
      );
    } catch (error) {
      console.error(error);
      setError(error);
      return;
    }

    console.log(res);

    setSightings(
      sightingsData.map((sighting) => {
        if (sighting.id === updatedSighting.id) {
          return updatedSighting;
        } else {
          return sighting;
        }
      })
    );
  }

  function setEditing(event, id) {
    setSightings(
      sightingsData.map((sighting) => {
        if (sighting.id === id) {
          return { ...sighting, isEditing: true };
        } else {
          return sighting;
        }
      })
    );
  }

  async function deleteSighting(event, id) {
    const url = `/api/sighting/${id}`;

    let res;
    try {
      res = await apiFetch(
        url,
        {
          method: "DELETE",
        },
        "Could not delete sighting"
      );
    } catch (error) {
      console.error(error);
      setError(error);
      return;
    }

    setSightings(sightingsData.filter((sighting) => sighting.id !== id));
  }

  const sightingsList = sightingsData.map((sighting) => {
    if (!sighting.isEditing) {
      return (
        <SightingEntry
          sighting={sighting}
          setEditing={setEditing}
          deleteSighting={deleteSighting}
        />
      );
    } else {
      return (
        <SightingForm
          formType="editSighting"
          sighting={sighting}
          submitSighting={updateSighting}
          key={sighting.id}
        />
      );
    }
  });

  return (
    <div className="homepage">
      <Header loggedin="true" />
      <div className="recentSightingsLog">
        <div className="recentSightingsHeader">
          <h1>Recent sightings</h1>
          <Link to={"/new-sighting"}>
            <FontAwesomeIcon icon={faPlusCircle} />
          </Link>
        </div>
        {sightingsList}
        {error &&
          (error.status ? (
            <div className="error">
              {error.message} because:{" "}
              {error.messages.map((message) => (
                <span>{message}</span>
              ))}
            </div>
          ) : (
            <div className="error">Could not fetch data</div>
          ))}
      </div>
      {/* <SightingForm submitSighting={addSighting} formType="addSighting" /> */}
      <button onClick={() => firebase.auth().signOut()}>Log out</button>
    </div>
  );
}
