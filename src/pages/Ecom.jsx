import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Ecom = () => {
    return (
    <div className="App">
      <h1>Project Ecom</h1>
      <nav>
        <ul>
          <li>
            <Link to="/dropin">Dropin</Link>
          </li>
          <li>
            <Link to="/components">Components</Link>
          </li>
        </ul>
      </nav>
    </div>
    );
}
export default Ecom;