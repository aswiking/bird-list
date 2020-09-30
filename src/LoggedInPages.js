import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./HomePage.js";
import SightingForm from "./SightingForm.js";
import ErrorMessage from "./ErrorMessage.js";
import apiFetch from "./api";

export default function LoggedInPages(props) {

  const [sightingsData, setSightings] = useState([]);
  const [error, setError] = useState(null);
  const [mapPin, setMapPin] = useState(null);
  const [selectedBird, setSelectedBird] = useState();
  const [selectedImages, setSelectedImages] = useState([]);



  useEffect(() => {

    const {currentUser} = props;

    async function fetchSightings() {
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
    }
    fetchSightings();
   
  }, [props]);

  function selectSpecies(option, action) {
    if (action.action === "select-option") {
      setSelectedBird(option.value);
    }
  }

  async function addSighting(event) {
    event.preventDefault();
    const newSighting = {
      bird_id: selectedBird,
      user_id: props.currentUser.uid,
      datetime: event.target.date.value,
      lat: mapPin.lat,
      lng: mapPin.lng,
      imageIDs:selectedImages,
      notes: event.target.notes.value,
    };
    console.log(props.currentUser);
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

  function placeMarker(map, event) {
    console.log(event.lngLat);
    setMapPin({ lat: event.lngLat.lat, lng: event.lngLat.lng });
  }

  /*async function updateSighting(event, originalSighting) {
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
  }*/

  /*function setEditing(event, id) {
    setSightings(
      sightingsData.map((sighting) => {
        if (sighting.id === id) {
          return { ...sighting, isEditing: true };
        } else {
          return sighting;
        }
      })
    );
  }*/

  /*  async function deleteSighting(event, id) {
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
  }*/

  return (
    <Switch>
      <Route path="/" exact>
        <HomePage
          currentUser={props.currentUser}
          sightingsData={sightingsData}
          error={error}
        />
      </Route>
      <Route path="/new-sighting" exact>
        <SightingForm
          currentUser={props.currentUser}
          submitSighting={addSighting}
          placeMarker={placeMarker}
          mapPin={mapPin}
          selectSpecies={selectSpecies}
          instagramUid={props.instagramUid} instagramToken={props.instagramToken}
          selectedImages={selectedImages} setSelectedImages={setSelectedImages}
        />
      </Route>
      <Route path="/*">
        <ErrorMessage />
      </Route>
    </Switch>
  );
}
