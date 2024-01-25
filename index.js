const express = require('express'); // it allow us to handle HTTP request 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth_routes');
const userRoute = require('./routes/user_routes');
const vehicelRoute = require('./routes/vehicle_route');
const createRideRoute = require('./routes/create_ride_routes');
const requestRideRoute = require('./routes/requset_ride_routes');
const cors = require('cors');

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

app.listen(process.env.PORT || 50001,
    console.log(`App is running at PORT ${process.env.PORT || 5001}`)
);

// script to get the city name --> 
/*
const address = "Railway station, Agarkar Nagar, Pune, Maharashtra 411001, India";

// Split the address by commas
const addressComponents = address.split(',');

// The city name is the last component after trimming any leading or trailing whitespace
const city = addressComponents[addressComponents.length - 3].trim();

console.log(city);  // Output: Pune

*/