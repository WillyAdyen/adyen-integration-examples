import React, { useState } from 'react';
import AdyenAPIHelper from '../../utils/helpers/AdyenAPIHelper';

const PosIntegration = ({ integrationType }) => {
  const [paymentResponse, setPaymentResponse] = useState("");

  const makePayment = () => {
    AdyenAPIHelper.makePOSPayment(integrationType)
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
    <button onClick={makePayment}>Pay</button>
    <p>{paymentResponse}</p>
  </div>
  );
}
export default PosIntegration;