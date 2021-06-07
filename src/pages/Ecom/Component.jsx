import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from "react-router";
import AdyenCheckout from "@adyen/adyen-web";
import AdyenAPIHelper from '../../utils/helpers/AdyenAPIHelper';
import SettingHelper from '../../utils/helpers/SettingHelper';

const Component = ( { paymentMethod } ) => {
    const errorRef = useRef(null)
    const [errorMsg, setErrorMsg] = useState("");
    const [resultCode, setResultCode] = useState("");

    useEffect(() => {
        renderComponent();
    }, []);

    function handleOnAdditionalDetails(state, component) {
        var body = {
            details: state.data.details,
            paymentData: state.data.paymentData
        }
        AdyenAPIHelper.handleDetails(body)
        .then(response => {
            setResultCode(response.resultCode);
        })
        .catch(error => {
            throw Error(error);
        });
    }

    const handleOnSubmit = (state, component) => {
        if (state.isValid) {
            AdyenAPIHelper.makePayment(state.data)
            .then(response => {
                if (response.action) {
                    var configuration = {};
                    var checkout;
                    switch (response.action.type) {
                        case "redirect":   
                            configuration = {
                                showPayButton: true,
                                locale: "en_US", // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/online-payments/components-web/localization-components.
                                environment: "test", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/online-payments/components-web#testing-your-integration.  
                                clientKey: "test_AWHTVRUIQBCC5IX6EVHDZZEO3UBYUUPJ", // Your client key. To find out how to generate one, see https://docs.adyen.com/development-resources/client-side-authentication. Web Components versions before 3.10.1 use originKey instead of clientKey.
                                paymentMethodsResponse: response, // The payment methods response returned in step 1.
                                onSubmit: handleOnSubmit, // Your function for handling onChange event
                                onAdditionalDetails: handleOnAdditionalDetails // Your function for handling onAdditionalDetails event
                            };
                
                            localStorage.setItem('paymentData', response.action.paymentData); // Not necessary for v67

                            checkout = new AdyenCheckout(configuration);
                            checkout.createFromAction(response.action).mount('#component-container');
                            break;
                        case "threeDS2Fingerprint":
                        case "threeDS2Challenge":
                            configuration = {
                                locale: "en_US",
                                environment: "test",
                                clientKey: "YOUR_CLIENT_KEY",
                                onAdditionalDetails: handleOnAdditionalDetails
                            };
                            
                            checkout = new AdyenCheckout(configuration);

                            // Optional configuration for the challenge window size
                            const threeDSConfiguration = {
                                size: '01'
                            // Set to any of the following:
                            // '02': ['390px', '400px'] -  The default window size
                            // '01': ['250px', '400px']
                            // '03': ['500px', '600px']
                            // '04': ['600px', '400px']
                            // '05': ['100%', '100%']
                            }
                            
                            checkout.createFromAction(response.action, threeDSConfiguration).mount('#component-container');

                            break;
                        case "sdk":
                        default:
                            component.handleAction(response.action);
                            break;
                            
                    }
                } else {
                    switch (response.resultCode) {
                        case "Authorised":
                            setResultCode('success');
                            break;
                        case "Error":
                            setResultCode('error');
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

    const renderComponent = () => {
        AdyenAPIHelper.getPaymentMethods()
        .then(data => {
            const configuration = {
                showPayButton: true,
                locale: SettingHelper.getSetting('locale'), // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/online-payments/components-web/localization-components.
                environment: "test", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/online-payments/components-web#testing-your-integration.  
                clientKey: "test_AWHTVRUIQBCC5IX6EVHDZZEO3UBYUUPJ", // Your client key. To find out how to generate one, see https://docs.adyen.com/development-resources/client-side-authentication. Web Components versions before 3.10.1 use originKey instead of clientKey.
                paymentMethodsResponse: data, // The payment methods response returned in step 1.
                onSubmit: handleOnSubmit, // Your function for handling onChange event
                onAdditionalDetails: handleOnAdditionalDetails // Your function for handling onAdditionalDetails event
            };
            const checkout = new AdyenCheckout(configuration);
            checkout.create(paymentMethod).mount('#component-container');
        });
    };

  return (
  <div>
    <h1>{paymentMethod}</h1>
    <p ref={errorRef}>{errorMsg}</p>
    <div id="component-container"></div>

    {resultCode && (<Redirect to={{
        pathname: "/confirmation",
        state: { resultCode: resultCode }
    }} />)}
    
  </div>
  );
}
export default Component;