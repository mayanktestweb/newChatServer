const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();


mongoose.connect(`${process.env.MONGODB_URL}`);

let db = mongoose.connection;
// Check mongoDb connection
db.once("open", function() {
console.log("Connected to mongo db successfully");
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

let userRouter = require('./router/user')
let conversationRouter = require('./router/conversation')
app.use(userRouter)
app.use(conversationRouter)


app.get("/", (req, res) => {
    console.log(`${process.env.name} is my name`);
    res.send("hellow world "+process.env.name);
});

app.use("/public", express.static('public'))


// socket related stuff

let Message = require('./models/Message')
let Conversation = require("./models/Conversation")

let defaultUserSockets = []

io.on("connection", (socket) => {

    console.log("a user is connected to default socket")

    socket.emit("request_userId");

    socket.on("register", (userId) => {
        defaultUserSockets.forEach((sok, index) => {
            if(sok.userId == userId) {
                sok.socket.disconnect()
                defaultUserSockets.splice(index, 1)
            }
        })
        defaultUserSockets.push({userId, socket});
    })

    socket.on("join_room", (conversationId) => {
        socket.join(conversationId)
    })

    socket.on("leave_room", (conversationId) => {
        socket.leave(conversationId)
    })

    // socket.on("message", (message) => {
    //     let x = io.sockets.adapter.rooms[message.conversation];
    //     if(x != null && x.length > 1) {
    //         io.to(message.conversation).emit("message_room", message);
    //     } else {
    //         if(defaultUserSockets.length > 0) {
    //             var userDefaultSocket = defaultUserSockets.find(sok => {
    //                 if(sok.userId == message.sent_to) return sok
    //             })
    //         }

    //         if(userDefaultSocket) {
    //             let defaultSocket = sok.socket;
    //             defaultSocket.emit("message", message)                
    //         } else {
    //             // save message to Server
    //             let msg = new Message({
    //                 conversation: message.conversation,
    //                 text: message.text,
    //                 isFile: message.isFile,
    //                 isImage: message.isImage,
    //                 fileRef: message.fileRef,
    //                 sender: message.sender
    //             });

    //             msg.save((err, m) => {
    //                 if(err) console.log(err)
    //                 else Conversation.updateOne({_id: message.conversation}, {$set: {lastMessage: m.text}})
    //             })
    //         }

    //         io.to(message.conversation).emit("message_room", message)
    //     }
    // })

    socket.on("message", message => {
        let sentToSocketLib = defaultUserSockets.find(sok => {
            if(sok.userId == message.sent_to) return sok
        })
        let sentToSocket = null
        if(sentToSocketLib) sentToSocket = sentToSocketLib.socket;

        if(sentToSocket) {
            sentToSocket.emit("message", message)
        } // else save message to server

        socket.emit("message", message);
    })

    socket.on("disconnect", () => {
        defaultUserSockets.forEach((sok, index, array) => {
            if (sok.socket == socket) {
                defaultUserSockets.splice(index, 1);
            }
        })

        console.log("a user is disconnected from default socket")
    })
})

let chatIo = io.of('/chat');

chatIo.on("connection", socket => {
    console.log("a user connected to chat socket");

    socket.on("join_room", (conversationId) => {
        socket.join(conversationId)
    })

    socket.on("leave_room", (conversationId) => {
        socket.leave(conversationId)
    })

    // socket.on("message", (message) => {
    //     console.log("message > "+JSON.stringify(message));
    //     if(chatIo.adapter.rooms[message.conversation].length > 1) {
    //         //socket.to(message.conversation).emit("message_room", message);
    //         io.of('/chat').to(message.conversation).emit('message_room', message);
    //     } else {
    //         let userDefaultSocket = defaultUserSockets.find(sok => {
    //             if(sok.userId == message.sent_to) return sok
    //         })

    //         if(userDefaultSocket) {
    //             let defaultSocket = sok.socket;
    //             defaultSocket.emit("message", message)                
    //         } else {
    //             // save message to Server
    //             let msg = new Message({
    //                 conversation: message.conversation,
    //                 text: message.text,
    //                 isFile: message.isFile,
    //                 isImage: message.isImage,
    //                 fileRef: message.fileRef,
    //                 sender: message.sender
    //             });

    //             msg.save((err, m) => {
    //                 if(err) console.log(err)
    //                 else Conversation.updateOne({_id: message.conversation}, {$set: {lastMessage: m.text}})
    //             })
    //         }

    //         io.of('/chat').to(message.conversation).emit('message_room', message);
    //     }
    // })

    socket.on("message", message => {
        console.log("message > "+JSON.stringify(message))
        let sentToSocketLib = defaultUserSockets.find(sok => {
            if(sok.userId == message.sent_to) return sok
        })
        let sentToSocket = null
        if(sentToSocketLib) sentToSocket = sentToSocketLib.socket;

        if(sentToSocket) {
            sentToSocket.emit("message", message)
        } // else save message to server

        let senderSocketLib = defaultUserSockets.find(sok => {
            if(sok.userId == message.sender) return sok
        })
        let senderSocket = null
        if(senderSocketLib) senderSocket = senderSocketLib.socket;

        if(senderSocket) {
            senderSocket.emit("message", message)
        } // else save message to server
    })
})


app.get("/dsocket", (req, res) => {
    console.log(defaultUserSockets)
    console.log("<  -----   >")
    //console.log(io.sockets)
    res.send("see console")
})


server.listen("8080", () => {
    console.log('server running on port 8080');
});