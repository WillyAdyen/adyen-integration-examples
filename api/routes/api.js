var express = require("express");
var router = express.Router();

const { Client, Config, CheckoutAPI } = require("@adyen/api-library");

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
        case "klarna":
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

const addRequestParameter = (param) => {
    var obj = {};

    if (param.nativeThreeDS === 'true') {
        Object.assign(obj, {
            additionalData: {
                allow3DS2: true
            }
        });
    }

    if (param.recurringProcessingModel !== "NoRecurring") {
        Object.assign(obj, {
            shopperReference: "WillyLarsson",
            shopperInteraction: "Ecommerce",
            recurringProcessingModel: param.recurringProcessingModel,
            storePaymentMethod: true
        });
    }

    return obj;
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
        redirectFromIssuerMethod: "GET",
        browserInfo: parameters.stateData.browserInfo,
        channel: "WEB",
        origin: parameters.origin
    };

    console.log(parameters);
    var paymentRequest = Object.assign(defaultPaymentRequest, getLPMData(parameters.stateData.paymentMethod.type), addRequestParameter(parameters));
    checkout.payments(paymentRequest).then(response => res.send(response)).catch(error => console.log(error));
});

router.post("/customPayments", function(req, res, next) {
    var checkout = createCheckout();
    console.log("Custom Payment Request", req.body);

    checkout.payments(req.body).then(response => res.send(response)).catch(error => console.log(error));
});

router.post("/details", function(req, res, next) {
    var checkout = createCheckout();
    const body = req.body;

    checkout.paymentsDetails(body).then(response => res.send(response)).catch(error => console.log(error));
});

module.exports = router;