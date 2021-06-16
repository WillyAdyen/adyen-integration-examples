import React from 'react';
import { Link } from 'react-router-dom';
import componentList from '../Ecom/componentList';

const Header = () => {
  return (
  <div className="header">
    <nav className="navbar">
        <ul className="navbar-level-one">
          <li>
            <Link to="/">Home</Link>
          </li>
          
          <li>
            <Link to="/ecom">Ecom</Link>
          </li>
          <ul className="navbar-level-two">
            <li>
              <Link to="/dropin">Dropin</Link>
            </li>
            <li>
              <Link to="/components">Components</Link>
              <ul className="navbar-level-three">
              {Object.keys(componentList).map((key) => (
                <li key={key}>
                  <Link to={"/"+componentList[key]}>{componentList[key]}</Link>
                </li>
              ))}
            </ul>
            </li>
            <li>
              <Link to="/paybylink">Pay By Link</Link>
            </li>
            <li>
              <Link to="/recurringpayments">Recurring Payments</Link>
            </li>
            <li>
              <Link to="/modifications">Modifications</Link>
            </li>
          </ul>
          
          <li>
            <Link to="/pos">POS</Link>
          </li>
          <ul className="navbar-level-two">
            <li>
              <Link to="/localapi">Local API</Link>
            </li>
            <li>
              <Link to="/cloudapisync">Cloud API Sync</Link>
            </li>
            <li>
              <Link to="/cloudapiasync">Cloud API Async</Link>
            </li>
          </ul>
        </ul>
      </nav>
  </div>
  );
}
export default Header;