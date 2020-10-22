import React, { useEffect, useState } from "react";

export default function Photo(props) {
  const [photoDetails, setPhotoDetails] = useState({});

  useEffect(() => {
    console.log(props)
    async function getImageUrl() {
      let res;
      res = await fetch(
        `https://graph.instagram.com/${props.instagramPhotoID}?fields=caption,media_url&access_token=${props.instagramToken}`
      );

      const variable = await res.json();

      setPhotoDetails(variable);
    }
    getImageUrl();
  }, []);
  return <img src={photoDetails.media_url} alt={photoDetails.caption}></img>;
}
