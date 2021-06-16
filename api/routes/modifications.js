var express = require("express");
var router = express.Router();

const { Client, Config, Modification } = require("@adyen/api-library");

function createModification() {
    const config = new Config();
    // Set your X-API-KEY with the API key from the Customer Area.
    config.apiKey = process.env.API_KEY;
    config.merchantAccount = process.env.MERCHANT_ACCOUNT;
    const client = new Client({ config });
    client.setEnvironment("TEST");
    return new Modification(client);
}

router.post("/capture", function(req, res, next) {
    var modification = createModification();
    const parameters = req.body;
    modification.capture({ 
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        originalReference: parameters.originalReference,
        modificationAmount: { currency: parameters.currency, value: parameters.amount },
        reference: "Capture_Modification"
    }).then(response => {
        res.send(response);
    });
});

router.post("/refund", function(req, res, next) {
    var modification = createModification();
    const parameters = req.body;
    modification.refund({ 
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        originalReference: parameters.originalReference,
        modificationAmount: { currency: parameters.currency, value: parameters.amount },
        reference: "Refund_Modification"
    }).then(response => {
        res.send(response);
    });
});

module.exports = router;