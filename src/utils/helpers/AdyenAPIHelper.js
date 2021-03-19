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
}

export default AdyenAPIHelper;
