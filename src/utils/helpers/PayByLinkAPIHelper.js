import SettingHelper from "./SettingHelper";

class PayByLinkAPIHelper {
    static generateLink = () => {
        return fetch("http://localhost:9000/api/paymentLinks",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currency: SettingHelper.getSetting("currency"),
            country: SettingHelper.getSetting("country"),
            locale: SettingHelper.getSetting("locale")
          })
        })
        .then(res => res.json())
        .then(data => {
          return data;
        }).catch(error => {
          throw Error(error);
        });
    }
}

export default PayByLinkAPIHelper;