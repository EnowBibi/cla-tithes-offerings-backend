const {Pay} = require('@nkwa-pay/sdk');

const pay = new Pay({
  apiKeyAuth: "6re58Nb-hqT6jDuo3Oapb",
  serverURL: "https://api.pay.mynkwa.com",
  debugLogger: console,
})

module.exports = pay;
