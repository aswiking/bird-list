import React from "react";
import { Link } from "react-router-dom";


export default function ListMenu() {
  return (
    <ul>
      <li>
        <Link to="/all-birds">
          <p>Full list of British birds</p>
        </Link>
        <Link to="/all-sightings">
          <p>All my sightings</p>
        </Link>
      </li>
    </ul>
  );
}
