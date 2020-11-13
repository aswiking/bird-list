import React, { useState, useEffect } from "react";
import apiFetch from "./api";
import Family from './Family.js';
import "./AllBirds.scss";

export default function AllBirds(props) {
  const { currentUser, setError } = props;

  const [birdData, setBirdData] = useState([]);

  useEffect(() => {
    async function fetchBirds() {
      const url = "/api/birds";

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          "Could not fetch bird list"
        );
      } catch (error) {
        console.error(error);
        setError(error);
        return;
      }

      const birds = await res.json();

      setBirdData(birds);
      console.log(birds);
    }
    fetchBirds();
  }, []);

  let categories = {};

  birdData.forEach((bird) => {
    if (!(bird.group_name in categories)) {
      categories[bird.group_name] = [bird]
    } else {
      categories[bird.group_name].push(bird)
    }
  });


 const birdList = Object.entries(categories).map((family, index) => {
   return <Family categoryData={family} key={index}/>
 })

return <ul className="bird-table">{birdList}</ul>;
}
