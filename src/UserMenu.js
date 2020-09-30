import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import './UserMenu.scss';

export default function UserMenu() {
  function logOut() {
    firebase.auth().signOut();
    localStorage.removeItem('instagramToken');
  }
  
  return <div className='userMenu'>
    <ul>
      <li>My sightings</li>
      <li onClick={logOut}><Link to="/">Log out</Link></li>
    </ul>

  </div>
}