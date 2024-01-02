const express = require('express'); // it allow us to handle HTTP request 
const mongoose = require('mongoose');
const authRoute = require('./routes/auth_routes');

const app = express(); // instance of express
const PORT = 9000;

app.get('/', (req, res) => {
    res.send(
        "Hello World"
    )
});

mongoose.connect('mongodb+srv://arunv3009:arun30EasyRideDB@easyridedb.wbuq8wm.mongodb.net/EasyRide').then(
    () => (console.log("Database is connected😊"))
).catch(
    (err) => {
        console.log(err);
    }
)

app.use(express.json());
app.use('/api/', authRoute);

app.listen(PORT,
    console.log(`App is running at PORT ${PORT}`)
);

