import React, { useState} from "react";
import AsyncSelect from "react-select/async";
import apiFetch from "./api";

export default function BirdDropDown(props) {
  const [error, setError] = useState(null);

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

  return <AsyncSelect className="bird-select" loadOptions={fetchBirds} placeholder='Start typing to see options' onChange={props.selectSpecies} />;
}
