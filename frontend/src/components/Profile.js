
import React from 'react';

function Profile(props) {


    return (
      <div>
        <h3>My profile</h3>
        <p>username {props.username}</p>
        <p>token {props.token}</p>
      </div>
    );
  }

  export default Profile;