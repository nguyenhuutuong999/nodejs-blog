const Course = require("../models/Course");
const uuidv1 = require("uuid/v1");
const https = require("https");
const firebaseApp = require("./../../config/db/firebase");
const config = require('./../../config/db/default.json');

const sortObject = (o) => {
  var sorted = {},
    key, a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}
class PaymentController {

  momo(request, response, next) {
    //parameters send to MoMo get get payUrl
    var endpoint =
      "https://test-payment.momo.vn/gw_payment/transactionProcessor";
    var hostname = "https://test-payment.momo.vn";
    var path = "/gw_payment/transactionProcessor";
    var partnerCode = "MOMOSDEI20201203";
    var accessKey = "ArJY3B0zEJuJlaID";
    var serectkey = "kFiLbcvI4ihPZ4jrUseCqqa4yOJcyNiu";
    var orderInfo = "pay with MoMo";
    var returnUrl = "http://localhost:8080/note";
    var notifyurl = "https://callback.url/notify";
    var amount = (request.body.value).toString();
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

  vnpay(req, res, next) {
    var ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;


    var dateFormat = require('dateformat');

    var tmnCode = config.vnp_TmnCode;
    var secretKey = config.vnp_HashSecret;
    var vnpUrl = config.vnp_Url;
    var returnUrl = config.vnp_ReturnUrl;

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = (req.body.value);
    var bankCode = '';

    var orderInfo = 'Top Up';
    var orderType = 'topup';
    var locale = 'vn';
    if (locale === null || locale === '') {
      locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount*100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require('sha256');

    var secureHash = sha256(signData);

    vnp_Params['vnp_SecureHashType'] = 'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
    //Neu muon dung Redirect thi dong dong ben duoi
    //res.status(200).json({ code: '00', data: vnpUrl })
    //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
    res.json(vnpUrl);
  }

  vnpaySuccess(req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var tmnCode = config.vnp_TmnCode;
    var secretKey = config.vnp_HashSecret;

    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require('sha256');

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
    } else {
      res.render('success', { code: '97' })
    }
  }
  result(req, res, next) {
    let statusCode = req.query.errorCode?req.query.errorCode:(req.query.vnp_ResponseCode?req.query.vnp_ResponseCode:null)
    let method = req.query.errorCode?1:(req.query.vnp_ResponseCode?0:-1)
    let amount = req.query.amount?req.query.amount:(req.query.vnp_Amount?req.query.vnp_Amount/100:null)
    if (statusCode == '0' || statusCode == '00') {
    firebaseApp
      .ref("User/information/parkingMan/idrootsv1")
      .once("value", (snapshot) => {
        firebaseApp
          .ref("User/information/parkingMan/")
          .child("idrootsv1")
          .update({
            money: (
              parseInt(snapshot.val().money) + parseInt(amount)
            ).toString(),
          });
      });
      var datetime = new Date();
      console.log(datetime.toISOString())
      
    firebaseApp
      .ref("History/parkingMan/moneyTopUp")
      .child("idrootsv1")
      .push({
        idPay: Date.now().toString(36) + Math.random().toString(36).substr(2),
        value: parseInt(amount).toString(),
        createAt: new Date().toISOString(),
        method: method,
        isNoti: false,
        fee: 0,
      });
      res.status(301).redirect("http://localhost:3000/payment/?status=0&value="+amount)
    }
    else{
      res.status(301).redirect("http://localhost:3000/payment/?status=1")
    }
    
    // res.set('location', 'http://localhost:3000/payment/');
    // res.json(302, {value: 1000});
    // // status(200).json({
    // //   message: "Payment Success !!!",
    // //   redirectUrl: "http://localhost:3000/payment/success",
    // //   value: amount,
    // //  })
  }

}
module.exports = new PaymentController();
