// Core
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routers
const authRouter = require('./routes/auth.routes');


const app = express();

// Cors Option
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}

app.use(express.json({ extended: true })).use(cors(corsOptions))

// Routes
app.use('/api/auth', authRouter);


const PORT = process.env.PORT;

const start = async () => {
    try {

       await mongoose.connect(process.env.MONGO_URI, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useCreateIndex: true
       })

    } catch (error) {
        console.log(`Server Error ${error.message}`)
        process.exit(1);
    }
}

start();

app.listen(PORT, () => {
    console.log(`App has been started on port ${PORT} ... `);
});














