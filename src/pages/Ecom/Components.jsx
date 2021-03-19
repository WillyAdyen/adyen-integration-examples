import React from 'react';
import { Link } from 'react-router-dom';

const Components = () => {
    return (
    <div className="App">
      <h1>Project Ecom</h1>
      <nav>
        <ul>
          <li>
            <Link to="/card">Card</Link>
          </li>
        </ul>
      </nav>
    </div>
    );
}
export default Components;