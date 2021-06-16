import SettingHelper from "./SettingHelper";

class ModificationsAPIHelper {
    static capture = (originalReference, amount) => {
        return fetch("http://localhost:9000/api/capture",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currency: SettingHelper.getSetting("currency"),
            originalReference: originalReference, //863623391705697D
            amount: amount
          })
        })
        .then(res => res.json())
        .then(data => {
          return data;
        }).catch(error => {
          throw Error(error);
        });
    }

    static refund = (originalReference, amount) => {
      return fetch("http://localhost:9000/api/refund",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency: SettingHelper.getSetting("currency"),
          originalReference: originalReference, //863623391705697D
          amount: amount
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

export default ModificationsAPIHelper;