import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import AdyenAPIHelper from '../utils/helpers/AdyenAPIHelper';

const Confirmation = () => {
  const [resultCode, setResultCode] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.resultCode) {
      setResultCode(location.state.resultCode);
    } else {
      const paymentData = localStorage.getItem('paymentData');
      const urlParams = new URLSearchParams(window.location.search);
      const payload = urlParams.get('payload') || urlParams.get('redirectResult');
      if (!payload) {
        var body = {
          details: {
            MD: urlParams.get('MD'),
            PaRes: urlParams.get('PaRes')
          },
          paymentData: paymentData
        };
      } else {
        var body = {
          details: {
            redirectResult: payload
          },
          paymentData: paymentData
        }
      }

      AdyenAPIHelper.handleDetails(body)
        .then(response => {
          setResultCode(response.resultCode);
        })
        .catch(error => {
            throw Error(error);
        });
    }
  }, []);

  return (
  <div>
    <h1>Confirmation</h1>
    <p>{resultCode}</p>
  </div>
  );
}
export default Confirmation;