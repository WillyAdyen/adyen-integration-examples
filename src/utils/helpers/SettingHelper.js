class SettingHelper {
    static getSetting(key) {
        const fallbackValues = {
            country: "NL",
            currency: "EUR",
            locale: "nl_NL"
        };

        return localStorage.getItem(key) ? localStorage.getItem(key) : fallbackValues[key];
    }
}
export default SettingHelper;
