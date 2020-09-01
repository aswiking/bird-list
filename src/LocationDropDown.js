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
        label: location.text,
      };
    });
  }

  return (
    <AsyncSelect className="location-select" loadOptions={fetchLocations} />
  );
}
