module.exports = {
    getSetting: function (key) {
        const fallbackValues = {
            country: "NL",
            currency: "EUR",
            nativeThreeDS: false,
            recurringProcessingModel: "NoRecurring",
            posRequestType: "Payment"
        };

        if (key === 'locale') {
            var country = localStorage.getItem('country') || fallbackValues.country;
            var language = 'en';
            switch (country) {
                case 'NL':
                    language = 'nl';
                    break;
                case 'SE':
                    language = 'sv';
                    break;
                default:
                    language = 'en';
                    break;
            };
            return language + '_' + country;
        }

        return localStorage.getItem(key) ? localStorage.getItem(key) : fallbackValues[key];
    }
}
