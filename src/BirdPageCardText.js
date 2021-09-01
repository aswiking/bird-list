import React from 'react';

export default function BirdPageCardText(props) {


  const { sighting, index, numberOfSightings } = props;

  console.log("numberOfSightings", numberOfSightings)

  const number = numberOfSightings - index;

  console.log('number', number);

  let ordinal;

  const keyString = number.toString();

  const keyLength = keyString.length;

  const lastDigit = keyString.substr(keyLength - 1);

  console.log('lastDigit', lastDigit);


  let lastTwoDigits;

  if (keyLength > 1) {
    lastTwoDigits = keyString.substr(keyLength - 2);
  }

  if (
    lastTwoDigits === "11" ||
    lastTwoDigits === "12" ||
    lastTwoDigits === "13"
  ) {
    //exeptions
    ordinal = `${keyString}th`;
  } else if (lastDigit === "1") {
    ordinal = `${keyString}st`;
  } else if (lastDigit === "2") {
    ordinal = `${keyString}nd`;
  } else if (lastDigit === "3") {
    ordinal = `${keyString}rd`;
  } else {
    ordinal = `${keyString}th`;
  }

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-GB", dateOptions);

  const sightingDate = dateTimeFormat.format(new Date(sighting.datetime));

  return (
    <div className="entrydetails">
      <h2>{ordinal} sighting</h2> <h4>{sightingDate}</h4>
  </div>
  )
}