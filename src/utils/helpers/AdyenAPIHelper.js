var SettingHelper = require("../helpers/SettingHelper");

class AdyenAPIHelper {
  static getPaymentMethods() {
    return fetch("http://localhost:9000/api/getPaymentMethods",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        country: SettingHelper.getSetting('country'),
        currency: SettingHelper.getSetting('currency')
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    }).catch(error => {
      throw Error(error);
    });
  }

  static makePayment(stateData) {
    return fetch("http://localhost:9000/api/payments",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stateData: stateData,
        origin: window.location.origin,
        country: SettingHelper.getSetting('country'),
        currency: SettingHelper.getSetting('currency')
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    }).catch(error => {
      throw Error(error);
    });
  }

  static handleDetails(body) {
    return fetch("http://localhost:9000/api/details",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
      return data;
    }).catch(error => {
      throw Error(error);
    });
  }

  static makePOSRequest(requestParameters) {
    return fetch("http://localhost:9000/api/makePOSRequest",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestParameters)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    }).catch(error => {
      throw Error(error);
    });
  }
}

export default AdyenAPIHelper;
