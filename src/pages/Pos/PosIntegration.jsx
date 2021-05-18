import React, { useState } from 'react';
import AdyenAPIHelper from '../../utils/helpers/AdyenAPIHelper';
import SettingHelper from '../../utils/helpers/SettingHelper';

const PosIntegration = ({ integrationType }) => {
  const [paymentResponse, setPaymentResponse] = useState("");

  const makeRequest = () => {
    var requestParameters = {
      integrationType: integrationType,
      type: "payment",
      country: SettingHelper.getSetting('country'),
      currency: SettingHelper.getSetting('currency')

    }
    AdyenAPIHelper.makePOSRequest(requestParameters)
    .then(response => {
        setPaymentResponse(JSON.stringify(response));
    })
    .catch(error => {
        throw Error(error);
    });
  }

  return (
  <div className="App">
    <h1>{integrationType}</h1>
    <button onClick={makeRequest}>Make request</button>
    <p>{paymentResponse}</p>
  </div>
  );
}
export default PosIntegration;