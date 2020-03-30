let SmsService = {
    sendOtp(mobile_number, otp) {
        return new Promise((resolve, reject) => {
            var req = unirest("POST", "https://www.fast2sms.com/dev/bulk");

            req.headers({
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache",
                "authorization": process.env.SMS_KEY
            });

            req.form({
                "sender_id": "FSTSMS",
                "language": "english",
                "route": "qt",
                "numbers": mobile_number,
                "message": "22062",
                "variables": "{#AA#}",
                "variables_values": otp
            });

            req.end(function (res) {
                if (res.error) reject("fail");
                return resolve("success");
            });
        })
    }
}

module.exports = SmsService;