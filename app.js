const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const config = require('config')

const app = express();

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}

//Connection string
mongoose
    .connect('mongodb://localhost:27017/flexi', {
        autoIndex: true
    })
    .then((res) => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error while connecting to MongoDB : ', err))


//Body parsee to read body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const retailerRoutes = require('./routes/retailer');

// Server started check URL
app.get('/', (req, res, next) => {
    res
        .status(200)
        .send('Server is running')
});

app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/retailer', retailerRoutes);

// No url found
app.use('/', (req, res, next) => {
    res
        .status(404)
        .send({
            message: 'No such url'
        })
})

module.exports = app;