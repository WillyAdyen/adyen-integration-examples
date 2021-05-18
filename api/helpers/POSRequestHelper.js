module.exports = {
    createRequest: function (type) {
        var saleToPOIRequest;
        switch (type) {
            case "payment":
                // Random ID from cash register
                const id = Math.floor(Math.random() * Math.floor(10000000)).toString();

                // Message header structure
                const messageHeader = {
                    messageClass: "Service",
                    messageType: "Request",
                    pOIID: "V400m-347299584",
                    protocolVersion: "3.0",
                    saleID: "DemoCashRegisterID",
                    serviceID: id,
                    messageCategory: "Payment"
                };
                saleToPOIRequest = {
                    messageHeader: messageHeader,
                    paymentRequest: {
                        saleData: {
                            saleTransactionID: {
                            transactionID: Math.floor(Math.random() * Math.floor(10000000)).toString(), // Random payment reference
                            timeStamp: new Date().toISOString()
                            }
                        },
                        paymentTransaction: {
                            amountsReq: {
                            currency: "EUR",
                            requestedAmount: parseFloat((Math.random() * (40)).toFixed(2)) // random amount
                            }
                        }
                    }
                };
                break;
            case "cardacquisition":
                break;
        }

        return saleToPOIRequest;
    }
};
  