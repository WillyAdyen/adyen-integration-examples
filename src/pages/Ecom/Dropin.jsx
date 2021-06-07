import React, { useEffect, useState, useRef } from "react";
import AdyenCheckout from "@adyen/adyen-web";
import AdyenAPIHelper from '../../utils/helpers/AdyenAPIHelper';
import { Redirect } from "react-router";
import SettingHelper from "../../utils/helpers/SettingHelper";

const Dropin = () => {
    const errorRef = useRef(null)
    const [errorMsg, setErrorMsg] = useState("");
    const [resultCode, setResultCode] = useState("");

    var dropIn = null;

    useEffect(() => {
        renderDropin();
      }, []);
    
    const renderDropin = () => {
    AdyenAPIHelper.getPaymentMethods()
        .then(data => {
        const configuration = {
            paymentMethodsResponse: data, // The `/paymentMethods` response from the server.
            clientKey: "test_AWHTVRUIQBCC5IX6EVHDZZEO3UBYUUPJ", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
            locale: SettingHelper.getSetting('locale'),
            environment: "test",
            onSubmit: (state, dropin) => {
                // Your function calling your server to make the `/payments` request
                AdyenAPIHelper.makePayment(state.data)
                .then(response => {
                    if (response.action) {
                    // Drop-in handles the action object from the /payments response
                        dropin.handleAction(response.action);
                        if (response.action.paymentData) {
                            localStorage.setItem('paymentData', response.action.paymentData); // Not necessary for v67
                        }
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
                var body = {
                    details: state.data.details,
                    paymentData: state.data.paymentData
                }
                AdyenAPIHelper.handleDetails(body)
                .then(response => {
                    console.log(response);
                    if (response.action) {
                        dropin.handleAction(response.action);
                    } else {
                        setResultCode(response.resultCode);
                    }
                })
                .catch(error => {
                    throw Error(error);
                });
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
{/*             <button onClick={refreshDropIn}>Refresh Drop-in</button> TODO
 */}            <p ref={errorRef}>{errorMsg}</p>
            <div id="dropin-container"></div>

            {resultCode && (<Redirect to={{
                        pathname: "/confirmation",
                        state: { resultCode: resultCode }
                      }} />)}
        </div>
    );
}
export default Dropin;