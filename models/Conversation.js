const mongoose = require('mongoose')

let conversationSchema = mongoose.Schema({
  is_group: {
    type: Boolean,
    default: false
  },

  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },

  group_name: {
    type: String,
    default: ""
  },

  users: [mongoose.Schema.Types.ObjectId],

  lastMessage: {
    type: String,
    default: ""
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Conversation', conversationSchema)