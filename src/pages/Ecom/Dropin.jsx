import React, { useEffect, useState, useRef } from "react";
import AdyenCheckout from "@adyen/adyen-web";
import AdyenAPIHelper from '../../utils/helpers/AdyenAPIHelper';

const Dropin = () => {
    const errorRef = useRef(null)
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        renderDropin();
      }, []);
    
    const renderDropin = () => {
    fetch("http://localhost:9000/api/getPaymentMethods")
        .then(res => res.json())
        .then(data => {
        const configuration = {
            paymentMethodsResponse: data, // The `/paymentMethods` response from the server.
            clientKey: "test_AWHTVRUIQBCC5IX6EVHDZZEO3UBYUUPJ", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
            locale: "en-US",
            environment: "test",
            onSubmit: (state, dropin) => {
                // Your function calling your server to make the `/payments` request
                console.log("before payment");
                AdyenAPIHelper.makePayment(state.data)
                .then(response => {
                    console.log(response);
                    if (response.action) {
                        console.log(response.action);
                    // Drop-in handles the action object from the /payments response
                        dropin.handleAction(response.action);
                    } else {
                        switch (response.resultCode) {
                            case "Authorised":
                                dropin.setStatus('success');
                                break;
                            case "Error":
                                dropin.setStatus('error');
                                break;
                            case "Refused":
                                setErrorMsg(response.refusalReason);
                                errorRef.current.scrollIntoView()
                                break;
                        };
                    }
                })
                .catch(error => {
                    throw Error(error);
                });
            },
            onAdditionalDetails: (state, dropin) => {
            // Your function calling your server to make a `/payments/details` request
/*             makeDetailsCall(state.data)
                .then(response => {
                if (response.action) {
                    // Drop-in handles the action object from the /payments response
                    dropin.handleAction(response.action);
                } else {
                    // Your function to show the final result to the shopper
                    showFinalResult(response);
                }
                })
                .catch(error => {
                throw Error(error);
                }); */
            },
            paymentMethodsConfiguration: {
            card: { // Example optional configuration for Cards
                hasHolderName: true,
                holderNameRequired: true,
                enableStoreDetails: true,
                hideCVC: false, // Change this to true to hide the CVC field for stored cards
                name: 'Credit or debit card'
            }
            }
            };

        const checkout = new AdyenCheckout(configuration);
        checkout.create('dropin').mount('#dropin-container');
        });
    };

    return (
        <div className="App">
            <h1>Drop-in</h1>
            <p ref={errorRef}>{errorMsg}</p>
            <div id="dropin-container"></div>
        </div>
    );
}
export default Dropin;