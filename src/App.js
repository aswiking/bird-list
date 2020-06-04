import React, { useState, useEffect } from "react";
import "./App.css";
import BirdForm from "./BirdForm";
import BirdEntry from "./BirdEntry";

function App() {
  const [birdData, setBirds] = useState([]);

  useEffect(() => {
    async function fetchBirds() {
      const res = await fetch("/api/birds");
      const birds = await res.json();
      setBirds(birds); 
      console.log(res);
    }
    fetchBirds();
  }, []);

  async function addBird(event) {
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

  async function deleteBird(event, id) {

    const url = `/api/birds/${id}`;

    const res = await fetch(url, {
      method: "DELETE"
    })

    setBirds(birdData.filter((bird) => bird.id !== id));
  }

  const birdList = birdData.map((bird) => {
    if (!bird.isEditing) {
      return (
        <BirdEntry bird={bird} setEditing={setEditing} deleteBird={deleteBird}/>
      );
    } else {
      return (
        <BirdForm formType="editBird" bird={bird} submitBird={updateBird} key={bird.id}/>
      );
    }
  });

  return (
    <div className="App">
      <h1>Birds we seen</h1>
      {birdList}
      <BirdForm submitBird={addBird} formType="addBird" />
    </div>
  );
}

export default App;
