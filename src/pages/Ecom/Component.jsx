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

    function handleOnAdditionalDetails(state, component) {
        var body = {
            details: state.data.details,
            paymentData: state.data.paymentData
        }

        AdyenAPIHelper.handleDetails(body)
        .then(response => {
                // TODO: handle result
/*                 "additionalData": {
                    "refusalReasonRaw": "AUTHORISED",
                    "eci": "05",
                    "threeDSVersion": "2.1.0",
                    "acquirerAccountCode": "TestPmmAcquirerAccount",
                    "threeDAuthenticated": "true",
                    "paymentMethodVariant": "visacredit",
                    "threeDOffered": "true",
                    "threeDOfferedResponse": "C",
                    "authorisationMid": "1000",
                    "cavv": "QURZRU4gM0RTMiBURVNUIENBVlY=",
                    "authorisedAmountCurrency": "SEK",
                    "threeDAuthenticatedResponse": "Y",
                    "dsTransID": "b8c3d03d-c4c3-403e-9f54-deb6b63d2471",
                    "avsResultRaw": "5",
                    "retry.attempt1.rawResponse": "AUTHORISED",
                    "paymentMethod": "visa",
                    "avsResult": "5 No AVS data provided",
                    "cardSummary": "0006",
                    "retry.attempt1.avsResultRaw": "5",
                    "networkTxReference": "053509878871285",
                    "expiryDate": "3/2030",
                    "cardBin": "421234",
                    "cvcResultRaw": "M",
                    "merchantReference": "YOUR_ORDER_NUMBER",
                    "acquirerReference": "7F6EHBKVI4N",
                    "cardIssuingCountry": "NL",
                    "liabilityShift": "true",
                    "authCode": "034214",
                    "cardHolderName": "Checkout Shopper PlaceHolder",
                    "isCardCommercial": "unknown",
                    "retry.attempt1.acquirerAccount": "TestPmmAcquirerAccount",
                    "retry.attempt1.acquirer": "TestPmmAcquirer",
                    "authorisedAmountValue": "1000",
                    "issuerCountry": "NL",
                    "cvcResult": "1 Matches",
                    "retry.attempt1.responseCode": "Approved",
                    "retry.attempt1.shopperInteraction": "Ecommerce",
                    "cardPaymentMethod": "visacredit",
                    "acquirerCode": "TestPmmAcquirer"
                },
                "fraudResult": {
                    "accountScore": 0,
                    "results": [
                        {
                            "FraudCheckResult": {
                                "accountScore": 0,
                                "checkId": -1,
                                "name": "Pre-Auth-Risk-Total"
                            }
                        }
                    ]
                },
                "pspReference": "863616167999008B",
                "resultCode": "Authorised",
                "amount": {
                    "currency": "SEK",
                    "value": 1000
                },
                "merchantReference": "YOUR_ORDER_NUMBER"
            } */
            console.log(response);
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
                    console.log(response.action);
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
                                onSubmit: handleOnSubmit // Your function for handling onChange event
                                //onAdditionalDetails: handleOnAdditionalDetails // Your function for handling onAdditionalDetails event
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
                    }
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