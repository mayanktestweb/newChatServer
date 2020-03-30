const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation'
  },

  text: {
    type: String,
    default: ""
  },
  
  isFile: {
    type: Boolean,
    default: false
  },

  fileRef: {
    type: String,
    default: ""
  },

  localLocation: {
    type: String,
    default: ""
  },

  isImage: {
    type: Boolean,
    default: false
  },

  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

},
{
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);