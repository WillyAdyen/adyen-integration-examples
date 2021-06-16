const posEnums = require("../../src/utils/enums/posEnums");

module.exports = {
    createRequest: function (type, serviceID, previousServiceID, currency, pOITransactionID) {
        var saleToPOIRequest;
        var messageHeader;
        var pOIID = "V400m-347299584";
        var saleID = "DemoCashRegisterID";
        var protocolVersion = "3.0";
        const transactionID = Math.floor(Math.random() * Math.floor(10000000)).toString();
        const timeStamp = new Date().toISOString();
        var amount = 1; // parseFloat((Math.random() * (40)).toFixed(2)); // random amount

        switch (type) {
            case posEnums.REQUEST_TYPE.PAYMENT:
            default:
                messageHeader = {
                    messageClass: "Service",
                    messageType: "Request",
                    pOIID: pOIID,
                    protocolVersion: protocolVersion,
                    saleID: saleID,
                    serviceID: serviceID,
                    messageCategory: "Payment" // Needs to be looked into and noy hardcoded
                };

                var paymentRequest = {
                    saleData: {
                        saleTransactionID: {
                        transactionID: transactionID,
                        timeStamp: timeStamp
                        }
                    },
                    paymentTransaction: {
                        amountsReq: {
                            currency: currency,
                            requestedAmount: amount
                        }
                    }
                }

                if (pOITransactionID) { // If the payment is initiated from a card acquisition
                    var paymentData = {
                        paymentData: {
                            cardAcquisitionReference: pOITransactionID
                        }
                    }

                    paymentRequest = Object.assign(paymentRequest, paymentData);
                }
        
                saleToPOIRequest = {
                    messageHeader: messageHeader,
                    paymentRequest: paymentRequest
                };

                break;
            case posEnums.REQUEST_TYPE.REFUND: // Referenced Refund
                messageHeader = {
                    messageClass: "Service",
                    messageType: "Request",
                    pOIID: pOIID,
                    protocolVersion: protocolVersion,
                    saleID: saleID,
                    serviceID: serviceID,
                    messageCategory: "Payment" // Needs to be looked into and noy hardcoded
                };
        
                saleToPOIRequest = {
                    messageHeader: messageHeader,
                    paymentRequest: {
                        saleData: {
                            saleTransactionID: {
                                transactionID: transactionID,
                                timeStamp: timeStamp
                            }
                        },
                        paymentTransaction: {
                            amountsReq: {
                                currency: currency,
                                requestedAmount: amount
                            }
                        },
                        paymentData: {
                            paymentType: "Refund"
                        }
                    }
                };
                break;
            case posEnums.REQUEST_TYPE.REVERSAL: // Unreferenced Refund
                messageHeader = {
                    messageClass: "Service",
                    messageType: "Request",
                    pOIID: pOIID,
                    protocolVersion: protocolVersion,
                    saleID: saleID,
                    serviceID: serviceID,
                    messageCategory: "Reversal" // Needs to be looked into and noy hardcoded
                };
        
                saleToPOIRequest = {
                    messageHeader: messageHeader,
                    reversalRequest: {
                        originalPOITransaction: {
                            pOITransactionID: {
                                transactionID: transactionID,
                                timeStamp: timeStamp
                            }
                        },
                        reversalReason:"MerchantCancel"
                    }
                };
                break;
            case posEnums.REQUEST_TYPE.ABORT:
                messageHeader = {
                    messageClass: "Service",
                    messageType: "Request",
                    pOIID: pOIID,
                    protocolVersion: protocolVersion,
                    saleID: saleID,
                    serviceID: serviceID,
                    messageCategory: "Abort" // Needs to be looked into and not hardcoded
                };
        
                saleToPOIRequest = {
                    messageHeader: messageHeader,
                    abortRequest: {
                        abortReason: "MerchantAbort",
                        messageReference: {
                          messageCategory: "Payment",
                          saleID: "DemoCashRegisterID",
                          serviceID: previousServiceID
                        }
                      }
                };
                break;
            case posEnums.REQUEST_TYPE.CARD_ACQUSITION:
                messageHeader = {
                    messageClass: "Service",
                    messageType: "Request",
                    pOIID: pOIID,
                    protocolVersion: protocolVersion,
                    saleID: saleID,
                    serviceID: serviceID,
                    messageCategory: "CardAcquisition" // Needs to be looked into and not hardcoded
                };
        
                saleToPOIRequest = {
                    messageHeader: messageHeader,
                    cardAcquisitionRequest: {
                        saleData: {
                            saleTransactionID: {
                                transactionID: transactionID,
                                timeStamp: timeStamp
                            },
                            tokenRequestedType: "Customer"
                        },
                        cardAcquisitionTransaction: {
                            totalAmount: amount
                        }
                    }
                };
                break;
        }

        return saleToPOIRequest;
    }
};
  