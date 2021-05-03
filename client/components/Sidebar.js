import React from 'react';
import LocationSearch from './LocationSearch'
import axios from 'axios';

const Sidebar = () => {
  return (
    <div id="sidebar">
      <div id="logo-card">
        <h2>Location^3</h2>
        <img src="./images/locationIcon_512.png" alt="logo" width="64px" />
        <p className="tiny-address">Rate the commute from your future home</p>
      </div>
      <hr width="99%" />
      <LocationSearch />
    </div>
  );
}

export default Sidebar;
