import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePageCardText(props) {

  const { sighting } = props;

  function dateDifference() {
    const todaysDate = new Date();

    const millisecDiff = todaysDate - new Date(sighting.datetime);
    const daysAgo = (Math.ceil(millisecDiff / (1000 * 60 * 60 * 24))- 1);
    let timeAgo;

    if ((daysAgo / 365) >= 2 ) {
      timeAgo = `${(Math.floor(daysAgo / 365))} years ago`;
    } else if ((daysAgo / 365) >= 1) {
      timeAgo = `${(Math.floor(daysAgo / 365))} year ago`;
    } else if ((daysAgo / 30) >= 2) {
      timeAgo = `${(Math.floor(daysAgo / 30))} months ago`;
    } else if ((daysAgo / 30) >= 1) {
      timeAgo = `${(Math.floor(daysAgo / 30))} month ago`;
    } else if ((daysAgo / 7) >= 2) {
      timeAgo = `${(Math.floor(daysAgo / 7))} weeks ago`;
    } else if ((daysAgo / 7) >= 1) {
      timeAgo = `${(Math.floor(daysAgo / 7))} week ago`;
    } else if (daysAgo >= 2) {
      timeAgo = `${(Math.floor(daysAgo))} days ago`;
    } else if (daysAgo === 1) {
      timeAgo = `${(Math.floor(daysAgo))} day ago`;
    } else {
      timeAgo = `${daysAgo} days ago`;
    }
    return timeAgo;
  }

  const timeAgo = dateDifference();

  return (
      <div className="entryDetails">
        <div className="name">
          <h2 className="birdName">{sighting.bird.common}</h2>
          <h3 className="scientific">{sighting.bird.scientific}</h3>
        </div>
        <h4>Last seen {timeAgo}</h4>
      </div>
      )
      
}