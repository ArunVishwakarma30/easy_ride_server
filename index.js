const express = require('express'); // it allow us to handle HTTP request 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth_routes');
const userRoute = require('./routes/user_routes');
const vehicelRoute = require('./routes/vehicle_route');

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
app.use('/', authRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicelRoute);

app.listen(process.env.PORT || 50001,
    console.log(`App is running at PORT ${process.env.PORT || 5001}`)
);

