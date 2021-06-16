import React from "react";
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
import Settings from "./pages/common/Settings";
import RecurringPayments from "./pages/Ecom/RecurringPayments";
import PayByLink from "./pages/Ecom/PayByLink";
import Modifications from "./pages/Ecom/Modifications";

const App = () => {  
  return (
      <Router>
        <Header />
        <div className="wrapper">
        <Settings />
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
          <Route exact path="/paybylink">
            <PayByLink />
          </Route>
          <Route exact path="/recurringpayments">
            <RecurringPayments />
          </Route>
          <Route exact path="/modifications">
            <Modifications />
          </Route>
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
