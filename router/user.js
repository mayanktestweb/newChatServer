const express = require('express');
let router = express.Router();

let UserController = require('../controllers/UserController');

let authMiddleware = require('../middlewares/auth');
let uploadMiddleware = require('../middlewares/upload');

router.use(authMiddleware);

router.post("/api/v1/register", (req, res) => {
    UserController.register(req, res);
})

router.post('/api/v1/verify', (req, res) => {
    UserController.verifyOtp(req, res);
})

router.post('/api/v1/resendcode', (req, res) => {
    UserController.resendOtp(req, res);
})

router.post('/api/v1/profile', uploadMiddleware.single('avatar'), (req, res, next) => {
    if(!req.isAuth) res.status(400).send("not authorized");
    else UserController.saveProfile(req, res, next);
})

router.post("/api/v1/user/validate_token", (req, res) => {
    console.log("i was called")
    if(!req.isAuth) res.status(200).json({valid: false, fullname: ""})
    UserController.validateToken(req, res);
})


router.post("/api/v1/contacts", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    console.log("get users by mobile number called")
    UserController.getUsersByMobileNumber(req, res);
})

module.exports = router;