import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import './UserMenu.scss';

export default function UserMenu(props) {
  function logOut() {
    firebase.auth().signOut();
    localStorage.removeItem('instagramToken');
  }

  // console.log(props.currentUser.name) // sort out
  
  return <div className='userMenu'>
    <ul>
      <li>You are logged in as <br></br>Sofia Wiking</li>
      <li onClick={logOut}><Link to="/">Log out</Link></li>
    </ul>

  </div>
}