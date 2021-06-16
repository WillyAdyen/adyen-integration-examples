import React, { useState } from "react";

import SettingHelper from "../../utils/helpers/SettingHelper";

const Settings = () => {
  const [country, setCountry] = useState(SettingHelper.getSetting('country'));
  const [currency, setCurrency] = useState(SettingHelper.getSetting('currency'));
  const [nativeThreeDS, setNativeThreeDS] = useState(SettingHelper.getSetting('nativeThreeDS'));
  const [recurringProcessingModel, setRecurringProcessingModel] = useState(SettingHelper.getSetting('recurringProcessingModel'));

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
      case "recurringProcessingModel":
        setRecurringProcessingModel(event.target.value);
        localStorage.setItem(event.target.name, event.target.value);
        break;
      default:
        break;
    }
  }

  return (
  <div>
    <h1>Settings</h1>
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
          <select id="recurringProcessingModel" name="recurringProcessingModel" value={recurringProcessingModel} onChange={onSettingChange}>
              <option value="NoRecurring">No Recurring</option>
              <option value="CardOnFile">CardOnFile</option>
              <option value="UnscheduledCardOnFile">UnscheduledCardOnFile</option>
              <option value="Subscription">Subscription</option>
          </select>
          <br/>
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
  </div>
  );
}
export default Settings;