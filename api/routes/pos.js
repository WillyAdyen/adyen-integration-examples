var express = require("express");
var router = express.Router();

const { Client, Config, CheckoutAPI, TerminalCloudAPI, TerminalLocalAPI } = require("@adyen/api-library");

var POSRequestHelper = require("../helpers/POSRequestHelper");

router.post("/makePOSRequest", function(req, res, next) {
    const config = new Config();
    // Set your X-API-KEY with the API key from the Customer Area.
    config.apiKey = "AQE6gXvdXN+ML0wU6mmxhmEH9LXKHtkVLbBFVXVXyGHlqW9Hkt56EdRyFThvE05KepFLKfILLX80ogOw6RDBXVsNvuR83LVYjEgiTGAH-OW4YvnwyOHFTw7DuMy7Ekac8obNRQ6nTyHhubw0q3Oc=-c3PIc;fSV]XT*2U>";
    config.merchantAccount = "WillylarssonPOS";
    config.environment = "TEST";

    const integrationType = req.body.integrationType;
    const requestType = req.body.requestType;
    const serviceID = req.body.serviceID;
    const previousServiceID = req.body.previousServiceID;
    const currency = req.body.currency;
    const pOITransactionID = req.body.pOITransactionID;

    switch (integrationType) {
        case "local":
            config.certificatePath = "/Users/willy/Documents/GitHub/Work/adyen-integration-examples/adyen-terminalfleet-test.pem";
            config.terminalApiLocalEndpoint = "https://192.168.0.144";
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
    
    const saleToPOIRequest = POSRequestHelper.createRequest(requestType, serviceID, previousServiceID, currency, pOITransactionID);
    
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
            })
            .catch((err) => {
              console.error(err);
            });
            break;
    }
});

module.exports = router;