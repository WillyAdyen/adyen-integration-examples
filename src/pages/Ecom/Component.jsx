import React, { useEffect, useState, useRef } from 'react';
import AdyenCheckout from "@adyen/adyen-web";
import AdyenAPIHelper from '../../utils/helpers/AdyenAPIHelper';

const Component = ( { paymentMethod } ) => {
    const errorRef = useRef(null)
    const [errorMsg, setErrorMsg] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");

    useEffect(() => {
        renderComponent();
    }, []);

    const handleOnSubmit = (state, component) => {
        if (state.isValid) {
            AdyenAPIHelper.makePayment(state.data)
            .then(response => {
                if (response.action) {
                    console.log(response.action);
                // Drop-in handles the action object from the /payments response
                    
                } else {
                    switch (response.resultCode) {
                        case "Authorised":
                            setPaymentStatus('success');
                            break;
                        case "Error":
                            setPaymentStatus('error');
                            break;
                        case "Refused":
                            setErrorMsg(response.refusalReason);
                            errorRef.current.scrollIntoView();
                            break;
                    };
                }
            })
            .catch(error => {
                throw Error(error);
            });
        }
    }
  /*
    function handleOnAdditionalDetails(state, component) {
        state.data // Provides the data that you need to pass in the `/payments/details` call.
        component // Provides the active component instance that called this event.
    }
   */

    const renderComponent = () => {
        fetch("http://localhost:9000/api/getPaymentMethods")
        .then(res => res.json())
        .then(data => {
            const configuration = {
                showPayButton: true,
                locale: "en_US", // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/online-payments/components-web/localization-components.
                environment: "test", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/online-payments/components-web#testing-your-integration.  
                clientKey: "test_AWHTVRUIQBCC5IX6EVHDZZEO3UBYUUPJ", // Your client key. To find out how to generate one, see https://docs.adyen.com/development-resources/client-side-authentication. Web Components versions before 3.10.1 use originKey instead of clientKey.
                paymentMethodsResponse: data, // The payment methods response returned in step 1.
                onSubmit: handleOnSubmit // Your function for handling onChange event
                //onAdditionalDetails: handleOnAdditionalDetails // Your function for handling onAdditionalDetails event
            };

            const checkout = new AdyenCheckout(configuration);
            checkout.create(paymentMethod).mount('#component-container');
        });
    };

  return (
  <div>
    <h1>{paymentMethod}</h1>
    <p ref={errorRef}>{errorMsg}</p>
    {
        !paymentStatus ? (<div id="component-container"></div>) : (<p>{paymentStatus}</p>)
    }
    
  </div>
  );
}
export default Component;