var SettingHelper = require("./SettingHelper");

class PaymentsAPIHelper {
  static getPaymentMethods() {
    return fetch("http://suspicious-hopper-c7358a.netlify.app:9000/api/getPaymentMethods",
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
      console.log("Get Payment Methods Response:", data);
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
        currency: SettingHelper.getSetting('currency'),
        nativeThreeDS: SettingHelper.getSetting('nativeThreeDS'),
        recurringProcessingModel: SettingHelper.getSetting('recurringProcessingModel')
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Payment Response", data);
      return data;
    }).catch(error => {
      throw Error("Payment Error", error);
    });
  }

  static makeCustomPayment(data) {
    return fetch("http://localhost:9000/api/customPayments",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Custom Payment Response", data);
      return data;
    }).catch(error => {
      throw Error("Custom Payment Error", error);
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
}

export default PaymentsAPIHelper;
