const express = require('express'); // it allow us to handle HTTP request 
const mongoose = require('mongoose');
const authRoute = require('./routes/auth_routes');
const dotenv = require('dotenv');

dotenv.config();
const app = express(); // instance of express

app.get('/', (req, res) => {
    res.send(
        "Hello World"
    )
});


mongoose.connect(process.env.MONGO_URL).then(
    () => (console.log("Database is connected😊"))
).catch(
    (err) => {
        console.log(err);
    }
)

app.use(express.json());
app.use('/api/', authRoute);

app.listen(process.env.PORT || 50001,
    console.log(`App is running at PORT ${process.env.PORT || 5001}`)
);

