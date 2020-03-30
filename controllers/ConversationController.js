let Conversation = require('../models/Conversation')

let ConversationController = {

    async getConversation(req, res) {
        let { senderId, recipientId } = req.body
        let conversation = await Conversation.findOne({users: {$eq: [senderId, recipientId]}})
        if(!conversation) {
            conversation = await Conversation.findOne({users: {$eq: [recipientId, senderId]}})
        }

        if(!conversation) {
            conversation = new Conversation({
              users: [senderId, recipientId]  
            })

            conversation.save((err, conv) => {
                if(err) res.status(400).send(err)
                res.status(200).json({ conversation: conv })
            })
        } else {
            res.status(200).json({conversation})
        }
    }
}

module.exports = ConversationController;