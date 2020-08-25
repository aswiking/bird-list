import React, { useState, useEffect } from 'react';
import apiFetch from "./api";


export default function BirdDropDown(props) {

  const [birdData, setBirds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBirds() {
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
        "/api/birds",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        "Could not fetch birds"
      );
      const birds = await res.json();
      setBirds(birds);
      console.log(birds)
    }
    fetchBirds();
  }, []);

  const options = birdData.map((bird) => {
    return <option value={bird.scientific}>{bird.common}</option>
  })

  console.log(birdData, options)

return <datalist id="birdnames">
{options}
</datalist>

}