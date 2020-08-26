import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
//import './UserMenu.scss';

export default function UserMenu() {
  return <div className='userMenu'>
    <ul>
      <li>My sightings</li>
      <li onClick={() => firebase.auth().signOut()}><Link to="/">Log out</Link></li>
    </ul>

  </div>
}