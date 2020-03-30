let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        default:""
    },
    cc: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        trim:true
    },
    avatar:{
        type:String,
        trim:true,
        default:""
    },
    is_activated:{
        type:Number,
        min:0,
        max:1,
        default:0
    },
    created_at:{
        type:Date,
        default: Date.now
    }, 
    otp: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('User', userSchema);