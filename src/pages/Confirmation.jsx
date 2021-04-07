import React, { useEffect, useState } from 'react';
import AdyenAPIHelper from '../utils/helpers/AdyenAPIHelper';

const Confirmation = () => {
  const [resultCode, setResultCode] = useState("");

  useEffect(() => {
    const paymentData = localStorage.getItem('paymentData');
    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('payload') || urlParams.get('redirectResult');

    var body = {
      details: {
        redirectResult: payload
      },
      paymentData: paymentData
    }

    AdyenAPIHelper.handleDetails(body)
      .then(response => {
        setResultCode(response.resultCode);
      })
      .catch(error => {
          throw Error(error);
      });
  }, []);

  return (
  <div>
    <h1>Confirmation</h1>
    <p>{resultCode}</p>
  </div>
  );
}
export default Confirmation;