import React, { useState } from 'react';
import POSAPIHelper from '../../utils/helpers/POSAPIHelper';
import SettingHelper from '../../utils/helpers/SettingHelper';
import posEnums from '../../utils/enums/posEnums';

const PosIntegration = ({ integrationType }) => {
  const [posRequestType, setPosRequestType] = useState(SettingHelper.getSetting('posRequestType'));
  const [paymentResponse, setPaymentResponse] = useState("");
  const [pOITransactionID, setPOITransactionID] = useState("");

  const typeOfRequest = (event) => {
    setPosRequestType(event.target.value);
    localStorage.setItem(event.target.name, event.target.value);
  }

  const makeRequest = () => {
    var previousServiceID = localStorage.getItem('previousServiceID');

    var serviceID = Math.floor(Math.random() * Math.floor(10000000)).toString();
    localStorage.setItem('previousServiceID', serviceID);

    var requestParameters = {
      integrationType: integrationType,
      requestType: posRequestType,
      serviceID: serviceID,
      previousServiceID: previousServiceID,
      country: SettingHelper.getSetting('country'),
      currency: SettingHelper.getSetting('currency'),
      pOITransactionID: pOITransactionID
    }

    POSAPIHelper.makePOSRequest(requestParameters)
    .then(response => {
      setPaymentResponse(JSON.stringify(response));
      if (response.saleToPOIResponse.cardAcquisitionResponse) {
        requestParameters.pOITransactionID = response.saleToPOIResponse.cardAcquisitionResponse.pOIData.pOITransactionID;
        requestParameters.requestType = "Payment";
        requestParameters.serviceID = Math.floor(Math.random() * Math.floor(10000000)).toString();
        console.log(response.saleToPOIResponse.cardAcquisitionResponse);
        POSAPIHelper.makePOSRequest(requestParameters)
        .then(response => {
          setPaymentResponse(JSON.stringify(response));
        })
        .catch(error => {
            throw Error(error);
        });
      }
    })
    .catch(error => {
        throw Error(error);
    });
  }

  return (
  <div className="App">
    <h1>{integrationType}</h1>
    <select id="posRequestType" name="posRequestType" defaultValue={posRequestType} onChange={typeOfRequest}>
        <option value={posEnums.REQUEST_TYPE.PAYMENT}>{posEnums.REQUEST_TYPE.PAYMENT}</option>
        <option value={posEnums.REQUEST_TYPE.REFUND}>{posEnums.REQUEST_TYPE.REFUND}</option>
        <option value={posEnums.REQUEST_TYPE.REVERSAL}>{posEnums.REQUEST_TYPE.REVERSAL}</option>
        <option value={posEnums.REQUEST_TYPE.ABORT}>{posEnums.REQUEST_TYPE.ABORT}</option>
        <option value={posEnums.REQUEST_TYPE.CARD_ACQUSITION}>{posEnums.REQUEST_TYPE.CARD_ACQUSITION}</option>
    </select>
    <button onClick={makeRequest}>Make request</button>
    <p>{paymentResponse}</p>
  </div>
  );
}
export default PosIntegration;