import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import apiFetch from "./api";

export default function BirdDropDown(props) {
  const [error, setError] = useState(null);

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

  async function fetchBirds(inputValue) {
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
      `/api/birds?query=${inputValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      "Could not fetch birds"
    );
    const birds = await res.json();

    return birds.map((bird) => {
      return { value: bird.id, label: bird.common };
    });
  }

  return (
    <AsyncSelect
      className="bird-select"
      loadOptions={fetchBirds}
      placeholder="Start typing to see options"
      onChange={props.selectSpecies}
      styles={customStyles}
      defaultValue={props.defaultValue}
      defaultInputValue={props.defaultLabel}
    />
  );
}
