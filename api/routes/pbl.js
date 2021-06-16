var express = require("express");
var router = express.Router();
const axios = require("axios");

router.post("/paymentLinks", function(req, res, next) {
    const passedData = req.body;

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY
      }
    }

    const body = {
      "reference": "PBL_REFERENCE",
      "amount": {
        "value": 4200,
        "currency": passedData.currency
      },
      "shopperReference": "UNIQUE_SHOPPER_ID_6728",
      "description": "Blue Bag - ModelM671",
      "countryCode": passedData.country,
      "merchantAccount": "WillylarssonECOM",
      "shopperLocale": passedData.locale
    }

    axios.post('https://checkout-test.adyen.com/v67/paymentLinks', body, config)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;