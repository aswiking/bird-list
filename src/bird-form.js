import React from 'react';

export default function BirdForm(props) {

    return <div>
        <h2> {props.formType === 'addBird' ? 'Add bird' : props.bird.name}
            </h2>
        <form onSubmit={(event) => props.submitBird(event, props.bird)}>
        <ul>
            {props.formType === 'addBird' && (<li>
                <label htmlFor='name'>Name</label> <input type='text' id='name'></input>
            </li>)}
            <li>
                <label htmlFor='scientific'>Scentific name</label> <input id='scientific' type='text' defaultValue={props.bird.scientific}></input>
            </li>
            <li>
                <label htmlFor='location'>Place seen</label> <input id='location' type='text' defaultValue={props.bird.location}></input>
            </li>
            <li>
                <label htmlFor='date'>Date seen</label> <input id='date' type='text' defaultValue={props.bird.date}></input>
            </li>
            <li>
                <label htmlFor='url'>Image url</label> <input id='url' type='text' defaultValue={props.bird.image}></input>
            </li>
        </ul>
        <button>Submit</button>
        </form>
    </div>
}

BirdForm.defaultProps = {
    bird:
    {id: "",
    name: "",
    scientific: "",
    location: "",
    date: "",
    image: ""}
}
