class AdyenAPIHelper {
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
        origin: window.location.origin
      })
    })
    .then(res => res.json())
    .then(data => {
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

  static makePOSPayment(integrationType) {
    return fetch("http://localhost:9000/api/makePOSPayment",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({integrationType})
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
