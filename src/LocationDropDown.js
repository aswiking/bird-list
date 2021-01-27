import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import apiFetch from "./api";

export default function LocationDropDown(props) {
  const [locationData, setLocations] = useState([]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgb(244, 250, 244)'
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: 'rgb(0, 128, 128)'
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: 'rgb(0, 128, 128)'
    }),
    option: (provided, state) => ({
      ...provided,
      color: 'rgb(0, 128, 128)'
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
      color: 'rgb(0, 128, 128)',
      backgroundColor: 'rgb(244, 250, 244)'
    }),
    menu: (provided, state) => ({
      ...provided,
      color: 'rgb(0, 128, 128)',
      backgroundColor: 'rgb(244, 250, 244)'
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'rgb(0, 128, 128)',
      backgroundColor: 'rgb(244, 250, 244)'
    })
  }

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
      styles={customStyles}
    />
  );
}
