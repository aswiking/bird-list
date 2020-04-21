import React, { useState, useEffect } from "react";
import "./App.css";
import BirdForm from "./bird-form";

function App() {
  const [birdData, setBirds] = useState([]);

  useEffect(() => {
    async function fetchBirds() {
      const res = await fetch("/api/birds");
      const birds = await res.json();
      setBirds(birds); // why doesn't this have to wait?
      console.log(res);
    }
    fetchBirds();
  }, []);

  const birdList = birdData.map((bird) => {
    if (!bird.isEditing) {
      return (
        <div className="birdEntry" key={bird.id}>
          <h2 className="birdName">{bird.name}</h2>
          <h3>{bird.scientific}</h3>
          <img src={bird.image} width="100" alt={bird.name}></img>
          <ul>
            <li >
              <p className="label">Place seen: </p>
              {bird.location}
            </li>
            <li >
              <p className="label">Date seen: </p>
              {bird.date}
            </li>
          </ul>
          <div className="buttons">
            <button onClick={(event) => setEditing(event, bird.id)}>
              Edit
            </button>
            <button onClick={(event) => deleteBird(event, bird.id)}>
              Delete
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <BirdForm formtype="editBird" bird={bird} submitBird={updateBird} key={bird.name}/>
      );
    }
  });

  async function submitBird(event) {
    event.preventDefault();
    console.log(event.target);
    const newBird = {
      name: event.target.name.value,
      scientific: event.target.scientific.value,
      location: event.target.location.value,
      date: event.target.date.value,
      image: event.target.url.value,
    };
    event.target.reset();

    const url = "/api/birds";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBird),
    });

    const bird = await res.json();

    setBirds([...birdData, bird]);
  }

  async function updateBird(event, originalBird) {
    event.preventDefault();
    console.log(event.target)

    const updatedBird = {
      id: originalBird.id,
      name: originalBird.name,
      scientific: event.target.scientific.value,
      location: event.target.location.value,
      date: event.target.date.value,
      image: event.target.url.value,
    };
    console.log(originalBird)

    const url = `/api/birds/${originalBird.id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBird),
    });

    console.log(res)

    setBirds(
      birdData.map((bird) => {
        if (bird.id === updatedBird.id) {
          return  updatedBird ;
        } else {
          return bird;
        }
      })
    );
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
    setBirds(birdData.filter((bird) => bird.id !== id));
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
