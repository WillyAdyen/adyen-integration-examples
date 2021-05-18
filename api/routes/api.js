var express = require("express");
var router = express.Router();

const { Client, Config, CheckoutAPI, TerminalCloudAPI, TerminalLocalAPI } = require("@adyen/api-library");

var POSRequestHelper = require("../helpers/POSRequestHelper");
const { param } = require("../app");

function createCheckout() {
    const config = new Config();
    // Set your X-API-KEY with the API key from the Customer Area.
    config.apiKey = process.env.API_KEY;
    config.merchantAccount = process.env.MERCHANT_ACCOUNT;
    const client = new Client({ config });
    client.setEnvironment("TEST");
    return new CheckoutAPI(client);
}

const getLPMData = (paymentMethodType) => {
    switch (paymentMethodType) {
        case "klarna_paynow":
        case "klarna_account":
            return {
                shopperLocale: "en_SE",
                countryCode: "SE",
                telephoneNumber: "+46 840 839 298",
                shopperEmail: "youremail@email.com",
                shopperName: {
                    firstName: "Testperson-se",
                    gender: "UNKNOWN",
                    lastName: "Approved"
                },
                shopperReference: "YOUR_UNIQUE_SHOPPER_ID",
                billingAddress: {
                    city: "Ankeborg",
                    country: "SE",
                    houseNumberOrName: "1",
                    postalCode: "12345",
                    street: "Stargatan"
                },
                deliveryAddress: {
                    city: "Ankeborg",
                    country: "SE",
                    houseNumberOrName: "1",
                    postalCode: "12345",
                    street: "Stargatan"
                },
                lineItems: [
                    {
                        quantity: "1",
                        amountExcludingTax: "331",
                        taxPercentage: "2100",
                        description: "Shoes",
                        id: "Item 1",
                        taxAmount: "69",
                        amountIncludingTax: "400",
                        productUrl: "URL_TO_PURCHASED_ITEM",
                        imageUrl: "URL_TO_PICTURE_OF_PURCHASED_ITEM"
                    },
                    {
                        quantity: "2",
                        amountExcludingTax: "248",
                        taxPercentage: "2100",
                        description: "Socks",
                        id: "Item 2",
                        taxAmount: "52",
                        amountIncludingTax: "300",
                        productUrl: "URL_TO_PURCHASED_ITEM",
                        imageUrl: "URL_TO_PICTURE_OF_PURCHASED_ITEM"
                    }
                ]
            }
        default:
            return {};
    }
}

router.post("/getPaymentMethods", function(req, res, next) {
    var checkout = createCheckout();
    const parameters = req.body;
    checkout.paymentMethods({ 
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        countryCode: parameters.country,
        amount: { currency: parameters.currency, value: 1000, },
        channel: "Web"
    }).then(response => {
        res.send(response);
    });
});

router.post("/payments", function(req, res, next) {
    var checkout = createCheckout();
    const parameters = req.body;

    var defaultPaymentRequest = { 
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        countryCode: parameters.country,
        paymentMethod: parameters.stateData.paymentMethod,
        amount: { currency: parameters.currency, value: 125, },
        reference: "YOUR_ORDER_NUMBER",
        returnUrl: "http://localhost:3000/confirmation",
        additionalData: {
            allow3DS2: true
        },
        browserInfo: parameters.stateData.browserInfo,
        channel: "WEB",
        origin: parameters.origin
    };

    var paymentRequest = Object.assign(defaultPaymentRequest, getLPMData(parameters.stateData.paymentMethod.type));

    checkout.payments(paymentRequest).then(response => res.send(response)).catch(error => console.log(error));
});

router.post("/details", function(req, res, next) {
    var checkout = createCheckout();
    const body = req.body;

    checkout.paymentsDetails(body).then(response => {
        res.send(response);
    });
});

router.post("/makePOSRequest", function(req, res, next) {
    const config = new Config();
    // Set your X-API-KEY with the API key from the Customer Area.
    config.apiKey = "AQE6gXvdXN+ML0wU6mmxhmEH9LXKHtkVLbBFVXVXyGHlqW9Hkt56EdRyFThvE05KepFLKfILLX80ogOw6RDBXVsNvuR83LVYjEgiTGAH-OW4YvnwyOHFTw7DuMy7Ekac8obNRQ6nTyHhubw0q3Oc=-c3PIc;fSV]XT*2U>";
    config.merchantAccount = "WillylarssonPOS";
    config.environment = "TEST";

    const integrationType = req.body.integrationType;

    switch (integrationType) {
        case "local":
            config.certificatePath = "/Users/willy/Documents/GitHub/Work/adyen-integration-examples/adyen-terminalfleet-test.pem";
            config.terminalApiLocalEndpoint = "https://192.168.38.115";
            break;
        case "cloudsync":
            config.terminalApiCloudEndpoint = "https://terminal-api-test.adyen.com/sync";
            break;
        case "cloudasync":
        default:
            config.terminalApiCloudEndpoint = "https://terminal-api-test.adyen.com/async";
            break;
    }

    const client = new Client({ config });
    
    const saleToPOIRequest = POSRequestHelper.createRequest("payment");
    
    const terminalAPIPaymentRequest = { saleToPOIRequest: saleToPOIRequest };

    let terminalApi;
    switch (integrationType) {
        case "local":
            terminalApi = new TerminalLocalAPI(client);

            const securityKey = {
                adyenCryptoVersion: 1,
                keyIdentifier: "test",
                keyVersion: 1,
                passphrase: "test",
              };
            terminalApi
            .request(terminalAPIPaymentRequest, securityKey)
            .then((obj) => {
              res.send(obj);
              console.log("No Error: ", JSON.stringify(obj));
            })
            
            .catch((err) => {
              console.error(err);
            });
            break;
        case "cloudsync":
            terminalApi = new TerminalCloudAPI(client);

            terminalApi
            .sync(terminalAPIPaymentRequest)
            .then((obj) => {
                res.send(obj);
              console.log("No Error: ", JSON.stringify(obj));
            })
            .catch((err) => {
              console.error(err);
            });
            break;
        case "cloudasync":
        default:
            terminalApi = new TerminalCloudAPI(client);

            terminalApi
            .async(terminalAPIPaymentRequest)
            .then((obj) => {
                res.send(obj);
              console.log("No Error: ", JSON.stringify(obj));
            })
            .catch((err) => {
              console.error(err);
            });
            break;
    }
});

module.exports = router;