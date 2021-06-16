import React from 'react';
import PaymentsAPIHelper from '../../utils/helpers/PaymentsAPIHelper';
import SettingHelper from '../../utils/helpers/SettingHelper';

const RecurringPayments = () => {
  const makePayment = () => {
    PaymentsAPIHelper.makeCustomPayment({
      amount: { currency: SettingHelper.getSetting("currency"), value: 2000 },
      paymentMethod: {
          type: 'scheme',
          storedPaymentMethodId: '8416231340266009',
      },
      reference: "Recurring_Payment",
      merchantAccount: "WillylarssonECOM",
      shopperInteraction: "ContAuth",
      recurringProcessingModel: SettingHelper.getSetting("recurringProcessingModel"),
      returnUrl: "www.adyen.com",
      shopperReference: "WillyLarsson"
    })
    .then(response => {
      console.log("Recurring Payments Response", response);
    })
    .catch(error => {
        throw Error(error);
    });
  };

  return (
  <div>
    <h1>Recurring Payments</h1>
    <button onClick={makePayment}>Perform Recurring Payment</button>
  </div>
  );
}
export default RecurringPayments;