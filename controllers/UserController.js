let User = require('../models/User');

let SmsService = require('../services/SmsService');
let jwt = require('jsonwebtoken');
let fs = require('fs');

let UserController = {
    
    async register(req, res) {
    
        let phone = req.body.phone
        let user = await User.findOne({phone});
        if(user == null) user = new User(req.body)
        let code = Math.floor(1000 + Math.random() * 9000);
        user.otp = code;
        await user.save();
        SmsService.sendOtp(user.phone, user.otp);
        res.status(200).json({phone: user.phone});
    },

    async verifyOtp(req, res) {
        let user = await User.findOne({phone: req.body.phone});
        if(user.otp == req.body.otp) {
            let token = jwt.sign({userId: user._id, phone: user.phone}, process.env.JWT_KEY)
            res.status(200).json({
                valid: true, fullname: user.fullname, userId: user._id,
                avatar: user.avatar, phone: user.phone, token: token
            });
        }
        else res.status(202).send("invalid otp");
    },

    async resendOtp(req, res) {
        let otp = Math.floor(1000 + Math.random() * 9000);
        let user = await User.findOne({phone: req.body.phone});
        user.otp = otp;
        await user.save()
        SmsService.sendOtp(req.body.phone, otp)
        res.status(200).send("otp sent")
    },

    async saveProfile(req, res, next) {
        let user = await User.findById(req.userId);
        user.fullname = req.body.fullname;
        let cola = req.file.originalname.split(".");
        let fileName = req.phone+"."+cola[cola.length-1];
        if(req.file.size !=  0) {
            user.avatar = fileName;
            fs.writeFile(__dirname + "/../public/avatars/"+ fileName, req.file.buffer, {flag: 'w'}, (err) => {
                if(err) { console.log(err); res.status(400).send({err}) }
                else user.save((error, u) => {
                    if(error) { console.log("user saving failed after w"); res.status(400).send({error}) } 
                    else res.status(200).json({
                        valid: true, fullname: user.fullname, userId: user._id,
                        avatar: user.avatar, phone: user.phone, token: req.token
                    });
                })
            })
        } else await user.save((err, u) => {
            if(err) { console.log("user saving failed"); res.status(400).send({err})}
            else res.status(200).send("success")
        })
    },

    async validateToken(req, res) {
        let user = await User.findById(req.userId);
        res.status(200).json({
            valid: true, fullname: user.fullname, userId: req.userId,
            avatar: user.avatar, phone: user.phone, token: req.token
        });
    },

    getUsersByMobileNumber(req, res) {
        try{
            const {phonenumber} = req.body;
            console.log(phonenumber.length)
            User.find({'phone': { $in: phonenumber }}).exec((err, users) => {
                if(err) res.status(400).send(err)
                var contactlist = [];
                users.forEach(elm => {
                    contactlist.push({
                        "userId" : elm._id,
                        "phone" : elm.phone,
                        "avatar" :elm.avatar,
                        "givenName":elm.fullname
                    })
                })
                res.status(200).json({registeredUsers: contactlist})
            });
  
      } catch (error) {
          res.status(400).send({error: 'OTP unmatched. try again.'})
      }
    }
}

module.exports = UserController;