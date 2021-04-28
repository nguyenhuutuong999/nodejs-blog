const Course = require("../models/Course");
const { multipleMongoosesToObject } = require("../../util/mongoose");
const uuidv1 = require("uuid/v1");
const https = require("https");
const firebaseApp = require("./../../config/db/firebase");
class PaymentController {
  create(request, response, next) {
    //parameters send to MoMo get get payUrl
    var endpoint =
      "https://test-payment.momo.vn/gw_payment/transactionProcessor";
    var hostname = "https://test-payment.momo.vn";
    var path = "/gw_payment/transactionProcessor";
    var partnerCode = "MOMOSDEI20201203";
    var accessKey = "ArJY3B0zEJuJlaID";
    var serectkey = "kFiLbcvI4ihPZ4jrUseCqqa4yOJcyNiu";
    var orderInfo = "pay with MoMo";
    var returnUrl = "http://localhost:3000/payment";
    var notifyurl = "https://callback.url/notify";
    var amount = request.body.value.toString();
    var orderId = uuidv1();
    var requestId = uuidv1();
    var requestType = "captureMoMoWallet";
    var extraData = "merchantName=;merchantId="; //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

    //before sign HMAC SHA256 with format
    //partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
    var rawSignature =
      "partnerCode=" +
      partnerCode +
      "&accessKey=" +
      accessKey +
      "&requestId=" +
      requestId +
      "&amount=" +
      amount +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&returnUrl=" +
      returnUrl +
      "&notifyUrl=" +
      notifyurl +
      "&extraData=" +
      extraData;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", serectkey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    var body = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      returnUrl: returnUrl,
      notifyUrl: notifyurl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
    });
    //Create the HTTPS objects
    var options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/gw_payment/transactionProcessor",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    //Send the request and get the response
    console.log("Sending....");
    var req = https.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", (body) => {
        response.json(JSON.parse(body).payUrl);
      });
      res.on("end", () => {
        console.log("No more data in response.");
      });
    });

    req.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    req.write(body);
    req.end();
  }
  success(req, res, next) {
  }
}
module.exports = new PaymentController();
