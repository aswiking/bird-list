import React, { useState } from "react";
import "./App.css";
import BirdForm from "./bird-form";
import cuid from "cuid";

function App() {
  const [birdData, setBirds] = useState([
    {
      id: 1,
      name: "blackbird",
      scientific: "Turdus merula",
      location: "Leicester",
      date: "13 April 2020",
      image: "https://twootz.com/assets/images/bird/Blackbird.jpg",
    },
    {
      id: 2,
      name: "robin",
      scientific: "Erithacus rubecula",
      location: "Leicester",
      date: "10 January 2020",
      image:
        "https://images.immediate.co.uk/production/volatile/sites/23/2014/12/GettyImages-511380252-08b8a2e.jpg",
    },
  ]);

  const birdList = birdData.map((bird) => {
    if (!bird.isEditing) {
      return (
        <div className="birdEntry">
          <h2 className="birdName">{bird.name}</h2>
          <h3>{bird.scientific}</h3>
          <img src={bird.image} width="100"></img>
          <ul>
            <li>
              <p className="label">Place seen: </p>
              {bird.location}
            </li>
            <li>
              <p className="label">Date seen: </p>
              {bird.date}
            </li>
          </ul>
          <div className="buttons">
            <button onClick={(event) => setEditing(event, bird.id)}>
              Edit
            </button>
            <button onClick={(event) => deleteBird(event, bird.id)}>Delete</button>
          </div>
        </div>
      );
    } else {
      return (
        <BirdForm formtype="editBird" bird={bird} submitBird={updateBird} />
      );
    }
  });

  function submitBird(event, bird) {
    event.preventDefault();
    const newBird = {
      id: cuid(),
      name: event.target.name.value,
      scientific: event.target.scientific.value,
      location: event.target.location.value,
      date: event.target.date.value,
      image: event.target.url.value,
    };
    setBirds([...birdData, newBird]);
    event.target.reset();
  }

  function updateBird(event, newBird) {
    event.preventDefault();
    console.log(newBird);
    setBirds(
      birdData.map((bird => {
        if (bird.id === newBird.id) {
          return {
            id: newBird.id,
            name: event.target.name.value,
            scientific: event.target.scientific.value,
            location: event.target.location.value,
            date: event.target.date.value,
            image: event.target.url.value,
          }
        } else {return bird}
      }))
    )
  }

  function setEditing(event, id) {
    setBirds(
      birdData.map((bird) => {
        if (bird.id === id) {
          return { ...bird, isEditing: true };
        } else {
          return bird;
        }
      })
    );
  }

  function deleteBird(event, id) {
    setBirds(
      birdData.filter(bird => bird.id !== id)
    )
  }

  return (
    <div className="App">
      <h1>Birds we seen</h1>
      {birdList}
      <BirdForm submitBird={submitBird} formType="addBird" />
    </div>
  );
}

export default App;
