import React from 'react';
import { Link } from 'react-router-dom';
import componentList from '../Ecom/componentList';

const Header = () => {
  return (
  <div className="header">
    <h1>Header</h1>
    <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/ecom">Ecom</Link>
          </li>
          <li>
            <Link to="/dropin">Dropin</Link>
          </li>
          <li>
            <Link to="/Components">Components</Link>
          </li>
          {Object.keys(componentList).map((key) => (
            <li key={key}>
              <Link to={"/"+componentList[key]}>{componentList[key]}</Link>
            </li>
          ))}
          <li>
            <Link to="/pos">POS</Link>
          </li>
        </ul>
      </nav>
  </div>
  );
}
export default Header;