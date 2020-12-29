import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import HomePage from "./HomePage.js";
import SightingForm from "./SightingForm.js";
import FullSighting from "./FullSighting.js";
import ErrorMessage from "./ErrorMessage.js";
import AllBirds from "./AllBirds.js";
import Bird from './Bird.js';
import apiFetch from "./api";

export default function LoggedInPages(props) {
  const [sightingsData, setSightings] = useState([]);
  const [error, setError] = useState(null);
  const [mapPin, setMapPin] = useState({ lat: 52.610044, lng: -1.156774 });
  const [selectedBird, setSelectedBird] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [sightingDetails, setSightingDetails] = useState({
    lat: 52.610044,
    lng: -1.156774,
    datetime: "2020-01-01",
  });

  const history = useHistory();
  const { currentUser } = props;

  useEffect(() => {
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
      photos: selectedImages,
      notes: event.target.notes.value,
    };
    event.target.reset();

    const url = "/api/sightings";

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
    setSelectedImages([]); //not working

    history.push("/");
  }

  function placeMarker(map, event) {
    console.log(event.lngLat);
    setMapPin({ lat: event.lngLat.lat, lng: event.lngLat.lng });
  }

  async function updateSighting(event, originalSighting) {
    event.preventDefault();

    const updatedSighting = {
      id: originalSighting.id,
      bird_id: originalSighting.bird_id,
      user_id: originalSighting.user_id,
      datetime: event.target.date.value,
      lat: mapPin.lat,
      lng: mapPin.lng,
      photos: selectedImages,
      notes: event.target.notes.value,
    };
    console.log("updated sighting", updatedSighting);

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

    setSightingDetails(updatedSighting);

    setSelectedImages([]);

    setIsEditing(false);
  }

  async function deleteSighting(event, id) {
    const url = `/api/sightings/${id}`;

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
    setSelectedImages([]);
    history.push("/");
  }

  return (
    <Switch>
      <Route path="/" exact>
        <HomePage
          currentUser={props.currentUser}
          sightingsData={sightingsData}
          error={error}
          instagramToken={props.instagramToken}
        />
      </Route>
      <Route path="/new-sighting" exact>
        <SightingForm
          currentUser={props.currentUser}
          submitSighting={addSighting}
          placeMarker={placeMarker}
          mapPin={mapPin}
          selectSpecies={selectSpecies}
          instagramUid={props.instagramUid}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          formType="new"
        />
      </Route>
      <Route path="/sightings/:sightingID">
        <FullSighting
          currentUser={props.currentUser}
          setError={setError}
          placeMarker={placeMarker}
          mapPin={mapPin}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          submitSighting={updateSighting}
          setMapPin={setMapPin}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          sightingDetails={sightingDetails}
          setSightingDetails={setSightingDetails}
          deleteSighting={deleteSighting}
        />
      </Route>
      <Route path="/all-birds">
        <AllBirds setError={setError} currentUser={props.currentUser} />
      </Route>
      <Route path="/birds/:birdID">
        <Bird           
          currentUser={props.currentUser}
          setError={setError} />
      </Route>
      <Route path="/*">
        <ErrorMessage />
      </Route>
    </Switch>
  );
}
