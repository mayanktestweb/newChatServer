const express = require('express');
let router = express.Router();

let ConversationController = require('../controllers/ConversationController');

let authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post("/api/v1/start_conversation", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    ConversationController.getConversation(req, res)
})

module.exports = router;