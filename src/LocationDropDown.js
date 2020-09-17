import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import apiFetch from "./api";

export default function LocationDropDown(props) {
  const [error, setError] = useState(null);
  const [locationData, setLocations] = useState([]);

  async function fetchLocations(inputValue) {
    let res;

    const geocodingUrl = "https://api.mapbox.com/geocoding/v5";

    const mapboxGeocodingUrl = `${geocodingUrl}/mapbox.places/${inputValue}.json?access_token=${props.accessToken}`;

    res = await apiFetch(mapboxGeocodingUrl, {}, "Could not fetch locations");
    const locations = await res.json();

    setLocations(
      locations.features.map((location) => {
        return {
          id: location.id,
          locationName: location.text,
          center: location.center,
        };
      })
    );

    return locations.features.map((location) => {
      return {
        value: location.id,
        label: location.place_name,
      };
    });
  }

  function selectLocation(option, action) {

    if (action.action === "select-option") {
      const locationDetails = locationData.find((location) => {
        return location.id === option.value;
      });
      const latLng = {lat: locationDetails.center[1], lng: locationDetails.center[0]}
      props.setMapCenter(latLng)
    }
  }

  return (
    <AsyncSelect
      className="location-select"
      placeholder="Start typing to see options"
      loadOptions={fetchLocations}
      onChange={selectLocation}
    />
  );
}
