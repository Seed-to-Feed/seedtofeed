import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';
import ViewFields from '../ViewFields/ViewFields';

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  return (
    <center>
    <div className="container">
      
      <h2>Welcome, {user.first_name}!</h2>
      <ViewFields userID={user.id}/>
    </div>
    </center>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
