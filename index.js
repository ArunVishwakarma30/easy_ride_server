const express = require('express'); // it allow us to handle HTTP request 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth_routes');
const userRoute = require('./routes/user_routes');
const vehicelRoute = require('./routes/vehicle_route');
const createRideRoute = require('./routes/create_ride_routes');
const requestRideRoute = require('./routes/requset_ride_routes');
const notificationRoute = require('./routes/notification_route');
const verifyOtpRoute = require('./routes/verify_otp_route');
const chatRoute = require('./routes/chat_route');
const messageRoute = require('./routes/messages_route');
const cors = require('cors');
const { Socket } = require('socket.io');

dotenv.config();
const app = express(); // instance of express

app.get('/', (req, res) => {
    res.send(
        "Hello World"
    )
});
// "test": "echo \"Error: no test specified\" && exit 1"

mongoose.connect(process.env.MONGO_URL).then(
    () => (console.log("Database is connected😊"))
).catch(
    (err) => {
        console.log(err);
    }
)

app.use(express.json());
app.use(cors());
app.use('/', authRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicelRoute);
app.use('/createRide', createRideRoute);
app.use('/requestRide', requestRideRoute);
app.use('/notification', notificationRoute);
app.use('/otp', verifyOtpRoute);
app.use('/chats', chatRoute);
app.use('/messages', messageRoute);

const server = app.listen(process.env.PORT || 50001,
    console.log(`App is running at PORT ${process.env.PORT || 5001}`)
);

const IO = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {  // here we set origin from where we access our server

        // for localhost
       origin : "http://localhost:3000/" 
        // hosted server
        // origin: "https://easyrideserver-production.up.railway.app/"
    }
});

IO.on("connection", (socket) => {
    console.log("Connected to sockets.");

    socket.on('setup', (userId) => {
        socket.join(userId);
        socket.broadcast.emit("online-user", userId); // this we will notify to all usre that this particular user is online
        console.log(userId);
    });

    socket.on('typing', (room) => {
        console.log("typing");
        console.log("room");
        socket.to(room).emit('typing', room);
    });

    socket.on('stop typing', (room) => {
        console.log("stop typing");
        console.log("room");
        socket.to(room).emit('stop typing', room);
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined : " + room);
    }) 

    socket.on("new message", (newMessgeRecieved) => {
        console.log(newMessgeRecieved);
        var chat = newMessgeRecieved.chat;
        var recId = newMessgeRecieved.receiver
       console.log(`newMessgeRecieved ${newMessgeRecieved }`);
       console.log(`newMessgeRecieved ${newMessgeRecieved.chat }`);

    //    console.log(chat);
    //     var room = chat._id;
        var sender = newMessgeRecieved.sender;

        // if (!sender || sender._id) {
        //     console.log("Sender not defiend");
        //     return;
        // }
        var senderId = sender._id;
        console.log(`Message senderId : ${senderId}`);

        // const users = chat.users;

        // if (!users) {
        //     console.log("User not found");
        //     return;
        // }

        // after passing through all the if statement then we will emit the message back 
        socket.to(recId).emit('message recieved', newMessgeRecieved);
        socket.to(recId).emit('message sent', "New message");
        console.log("objectfasdf fasdfd afdfsaf fa");
        
    });


    socket.off("setup", (userId)=>{
        console.log("User offline");
        socket.leave(userId)
    })

})

// script to get the city name --> 
/*
const address = "Railway station, Agarkar Nagar, Pune, Maharashtra 411001, India";

// Split the address by commas
const addressComponents = address.split(',');

// The city name is the last component after trimming any leading or trailing whitespace
const city = addressComponents[addressComponents.length - 3].trim();

console.log(city);  // Output: Pune

*/
