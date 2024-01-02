const express = require('express'); // it allow us to handle HTTP request 
const mongoose = require('mongoose');
const authRoute = require('./routes/auth_routes');
const dotenv = require('dotenv');

dotenv.config();
const app = express(); // instance of express
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello World"
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

app.listen(PORT,
    console.log(`App is running at PORT ${PORT}`)
);

