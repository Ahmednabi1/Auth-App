// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Root route
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

sequelize.sync()
    .then(result => {
        app.listen(3000, () => console.log('Server started on http://localhost:3000'));
    })
    .catch(err => console.log(err));
