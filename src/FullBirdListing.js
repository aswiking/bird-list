import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "./api";

export default function FullBirdListing(props) {
  const [sightingDetails, setSightingDetails] = useState({});
  const { sightingID } = useParams();

  useEffect(() => {
    async function fetchSighting() {
      let token;
      try {
        token = await props.currentUser.getIdToken();
      } catch (error) {
        console.error(error);
        props.setError({
          message: "Could not authorise",
        });
        return;
      }


      let res;

      const url = `/api/sightings/${sightingID}`;

      res = await apiFetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        "Could not fetch sighting details"
      );

      const sightingData = await res.json();
      console.log(sightingData);
      setSightingDetails(sightingData);
    }
    fetchSighting(); 
  }, []);

  return <p> {sightingDetails.common}</p>;
}
