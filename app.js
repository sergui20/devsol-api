require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/devsol', { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('Connected to mongo')
    })
    .catch(err => {
        console.log('Error connecting to mongo', err)
    });

app.use(express.static(path.resolve(__dirname, './public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3001', /*'https://blah.herokuapp.com'*/]
}));
app.use(session({
    secret: 'YeiDevSol',
    cookie: { maxAge: 86400000  },
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport
require('./config/passport');

const server = http.createServer(app);

// Sockets
module.exports.io = socketIO(server);
require('./config/sockets');
// app.set("io", this.io);

// Routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes)

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes)

server.listen(process.env.PORT, () => {
    console.log('Server listening on port 8080')
});
