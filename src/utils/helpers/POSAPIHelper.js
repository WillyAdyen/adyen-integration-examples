class POSAPIHelper {
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
      return data;
    }).catch(error => {
      throw Error(error);
    });
  }
}

export default POSAPIHelper;
