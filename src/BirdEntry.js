import React from "react";


export default function BirdEntry (props){
return <div className="birdEntry" key={props.bird.id}>
          <h2 className="birdName">{props.bird.name}</h2>
          <h3>{props.bird.scientific}</h3>
          <img src={props.bird.image} width="100" alt={props.bird.name}></img>
          <ul>
            <li >
              <p className="label">Place seen: </p>
              {props.bird.location}
            </li>
            <li >
              <p className="label">Date seen: </p>
              {new Date(props.bird.date).toLocaleDateString()}
            </li>
          </ul>
          <div className="buttons">
            <button onClick={(event) => props.setEditing(event, props.bird.id)}>
              Edit
            </button>
            <button onClick={(event) => props.deleteBird(event, props.bird.id)}>
              Delete
            </button>
          </div>
        </div>}