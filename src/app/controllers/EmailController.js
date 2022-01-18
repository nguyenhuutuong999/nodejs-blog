const nodemailer = require("nodemailer");

class EmailController{
    resetPassword(req, res, next){
        let testAccount = nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'viettruongduc92@gmail.com', // generated ethereal user
              pass: 'viet15092019', // generated ethereal password
            },
          });
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'nguyenhuutuong99@gmail.com',
            to: 'nguyenhuutuong999@gmail.com',
            subject: 'Test Nodemailer',
            text: 'You recieved message from ' + req.body.email,
            html: '<p>You have got a new message</b><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
        }

        transporter.verify((error, success) => {
            if (error) {
                console.log(1111111111111)
            } else {
                //this means success
                console.log('Ready to send mail!')
            }
            })

        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log("err", err);
            } else {
                console.log('Message sent: ' +  info.response);
            }
        });
    }
}

module.exports = new EmailController();