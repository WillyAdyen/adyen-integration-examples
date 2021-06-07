import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import '@adyen/adyen-web/dist/adyen.css';
import componentList from './pages/Ecom/componentList';

//Components
import Header from './pages/common/Header';
import Home from './pages/Home';
import Pos from './pages/Pos';
import Ecom from './pages/Ecom';
import Dropin from './pages/Ecom/Dropin';
import Components from "./pages/Ecom/Components";
import Component from "./pages/Ecom/Component";
import Confirmation from "./pages/Confirmation";
import PosIntegration from "./pages/Pos/PosIntegration";
import SettingHelper from "./utils/helpers/SettingHelper";

const App = () => {
  const [country, setCountry] = useState(SettingHelper.getSetting('country'));
  const [currency, setCurrency] = useState(SettingHelper.getSetting('currency'));
  const [nativeThreeDS, setNativeThreeDS] = useState(SettingHelper.getSetting('nativeThreeDS'));

  const onSettingChange = (event) => {
    switch (event.target.name) {
      case "country":
        setCountry(event.target.value);
        localStorage.setItem(event.target.name, event.target.value);
        break;
      case "currency":
        setCurrency(event.target.value);
        localStorage.setItem(event.target.name, event.target.value);
        break;
      case "nativeThreeDS":
        setNativeThreeDS(event.target.checked);
        localStorage.setItem(event.target.name, event.target.checked);
        break;
      default:
        break;
    }
  }
  
  return (
      <Router>
        <Header />
        <div className="wrapper">
        <div>
          <p>Regular: 4111111111111111</p>
          <p>Refusal: 4444333322221111</p>
          <p>3DS1: 4212345678901237</p>
          <p>3DS2: 4917610000000000</p>
          <div>
            <input type="checkbox" id="nativeThreeDS" name="nativeThreeDS" defaultChecked={nativeThreeDS === 'true'} onChange={onSettingChange} />
            <label htmlFor="nativeThreeDS">Native 3DS2</label>
          </div>
          <br/>
          <select id="country" name="country" value={country} onChange={onSettingChange}>
              <option value="BE">Belgium</option>
              <option value="NL">Netherlands</option>
              <option value="SE">Sweden</option>
              <option value="US">United States of America</option>
          </select>
          <select id="currency" name="currency" value={currency} onChange={onSettingChange}>
              <option value="EUR">EUR</option>
              <option value="SEK">SEK</option>
              <option value="USD">USD</option>
          </select>
        </div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/ecom">
            <Ecom />
          </Route>
          <Route exact path="/dropin">
            <Dropin />
          </Route>
          <Route exact path="/components">
            <Components />
          </Route>
          {Object.keys(componentList).map((key) => (
            <Route key={key} exact path={"/"+componentList[key]}>
              <Component paymentMethod={componentList[key]} />
            </Route>
          ))}
          <Route exact path="/pos">
            <Pos />
          </Route>
          <Route exact path="/localapi">
            <PosIntegration integrationType={"local"} />
          </Route>
          <Route exact path="/cloudapisync">
            <PosIntegration integrationType={"cloudsync"} />
          </Route>
          <Route exact path="/cloudapiasync">
            <PosIntegration integrationType={"cloudasync"} />
          </Route>
          <Route exact path="/confirmation">
            <Confirmation />
          </Route>
        </Switch>
        </div>
      </Router>
  );
};

export default App;
