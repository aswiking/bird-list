import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory, Link } from "react-router-dom";
import HomePage from "./Homepage.js";
import SightingFormPage from "./SightingFormPage.js";
import SightingPage from "./SightingPage.js";
import BirdPage from "./BirdPage.js";
import ErrorMessage from "./ErrorMessage.js";
import AllBirds from "./AllBirds.js";
import apiFetch from "./api";
import Header from "./Header.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./LoggedInPages.scss";

export default function LoggedInPages(props) {
  const [sightingsData, setSightings] = useState([]);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [mapPin, setMapPin] = useState({});
  const [selectedBird, setSelectedBird] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState({
    field: null,
    message: null,
  });

  const history = useHistory();
  const { currentUser } = props;

  async function fetchSightings() {
    //moved this to outside the useEffect so I can call it from elsewhere. is allowed?
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
        "/api/sightings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        "Could not fetch sightings"
      );
    } catch (error) {
      setError(error);
      return;
    }
    const sightings = await res.json();
    setSightings(sightings);
  }

  useEffect(() => {
    fetchSightings();
  }, [currentUser]);

  useEffect(() => {
    async function getUserDetails() {
      let res;

      const url = `https://graph.instagram.com/me?fields=username&access_token=${props.instagramToken}`;

      res = await apiFetch(url, {}, "Could not fetch username");

      const userDetails = await res.json();
      setUserName(userDetails.username);
    }

    if (props.instagramToken) {
      getUserDetails();
    } else {
      setUserName(currentUser.displayName);
    }
  }, [props.instagramToken, currentUser.displayName]);

  function selectSpecies(option, action) {
    if (action.action === "select-option") {
      setSelectedBird(option.value);
    }
  }

  async function addSighting(event) {
    event.preventDefault();

    if (!selectedBird) {
      setRequiredMessage({
        field: "species",
        message: "You must select a species",
      });
      return;
    } else if (!event.target.date.value) {
      setRequiredMessage({
        field: "date",
        message: "You must select a date",
      });
      return;
    }

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

    console.log("newSighting:", newSighting);

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

    let newSightingsArray = [...sightingsData, sighting];

    newSightingsArray.sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      if (dateA < dateB) {
        return 1;
      } else if (dateA > dateB) {
        return -1;
      } else {
        return 0;
      }
    });

    const trimmedArray = newSightingsArray.slice(0, 6);

    setSightings(trimmedArray);
    setSelectedImages([]); //not working
    setMapPin({});

    history.push("/");
  }

  function placeMarker(map, event) {
    console.log(event.lngLat);
    setMapPin({ lat: event.lngLat.lat, lng: event.lngLat.lng });
  }

  async function updateSighting(event, originalSighting) {
    event.preventDefault();

    console.log("selected images", selectedImages);

    const updatedSighting = {
      id: originalSighting.id,
      bird_id: originalSighting.bird.id,
      user_id: originalSighting.user_id,
      datetime: event.target.date.value,
      lat: mapPin.lat,
      lng: mapPin.lng,
      photos: selectedImages,
      notes: event.target.notes.value,
    };

    console.log("updatedSighting", updatedSighting);

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

    setSelectedImages([]);
    setIsEditing(false);
    fetchSightings(); //s this a sensible way to do it
    return updatedSighting;
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

    setSelectedImages([]);
    history.push("/");
    window.location.reload();
    // is this acceptable?
    setIsEditing(false);
  }

  if (error) {
    return (
      <div>
        <Header
          loggedin="true"
          currentUser={props.currentUser}
          userName={userName}
          setInstagramToken={props.setInstagramToken}
        />
        <div className="error-message">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="exclamation-icon"
            size="2x"
          />
          <p>{error.message}</p>
          <Link to="/" className="homepage-link" onClick={() => setError(null)}>
            <p>Back to homepage</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <HomePage
          currentUser={props.currentUser}
          sightingsData={sightingsData}
          error={error}
          instagramToken={props.instagramToken}
          userName={userName}
          setInstagramToken={props.setInstagramToken}
        />
      </Route>
      <Route path="/new-sighting/:id?/:common?">
        {/* removed 'exact' */}
        <SightingFormPage
          currentUser={props.currentUser}
          submitSighting={addSighting}
          placeMarker={placeMarker}
          mapPin={mapPin}
          setMapPin={setMapPin}
          selectSpecies={selectSpecies}
          setSelectedBird={setSelectedBird}
          instagramUid={props.instagramUid}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          formType="new"
          requiredMessage={requiredMessage}
          setRequiredMessage={setRequiredMessage}
          userName={userName}
          setInstagramToken={props.setInstagramToken}
          providedSpecies={props.providedSpecies}
        />
      </Route>
      <Route path="/sightings/:sightingID">
        <SightingPage
          currentUser={props.currentUser}
          setError={setError}
          mapPin={mapPin}
          placeMarker={placeMarker}
          setMapPin={setMapPin}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          submitSighting={updateSighting}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          deleteSighting={deleteSighting}
          requiredMessage={requiredMessage}
          userName={userName}
          setInstagramToken={props.setInstagramToken}
          fetchSightings={fetchSightings}
        />
      </Route>
      <Route path="/all-birds">
        <AllBirds
          setError={setError}
          currentUser={props.currentUser}
          userName={userName}
          setInstagramToken={props.setInstagramToken}
        />
      </Route>
      <Route path="/birds/:birdID">
        <BirdPage
          currentUser={props.currentUser}
          setError={setError}
          placeMarker={placeMarker}
          mapPin={mapPin}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          submitSighting={updateSighting}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          deleteSighting={deleteSighting}
          selectSpecies={selectSpecies}
          // userName={userName}
          setInstagramToken={props.setInstagramToken}
        />
      </Route>
      <Route path="/new-sighting/:birdID/:commonName">
        <SightingFormPage
          currentUser={props.currentUser}
          submitSighting={addSighting}
          placeMarker={placeMarker}
          mapPin={mapPin}
          setMapPin={setMapPin}
          selectSpecies={selectSpecies}
          instagramUid={props.instagramUid}
          instagramToken={props.instagramToken}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          formType="new"
          requiredMessage={requiredMessage}
          userName={userName}
          setInstagramToken={props.setInstagramToken}
        />
      </Route>
      <Route path="/*">
        <ErrorMessage
          userName={userName}
          setInstagramToken={props.setInstagramToken}
        />
      </Route>
    </Switch>
  );
}
