const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const dbConfig = require('./config/database');

const port = process.env.PORT || 5000;

const app = express();

// Load Routes
const ideasRoute = require('./routes/ideas');
const usersRoute = require('./routes/users');

// Map global promise
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.mongoURI, {
	useNewUrlParser: true
})
.then( () => console.log('MongoDB Connected...'))
.catch( err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	//cookie: { secure: true } // to be used with HTTPS only
}));

// Passport config
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Connect flash middleware
app.use(flash());

// Global variables
app.use(function(req, resp, next) {
	resp.locals.success_msg = req.flash('success_msg');
	resp.locals.error_msg = req.flash('error_msg');
	resp.locals.error = req.flash('error');
	resp.locals.user = req.user || null;

	next();
});

// Index route
app.get('/', function(req, resp) {
	const username = 'John Doe';
	resp.render('index', {
		username: username
	});
});

// About route
app.get('/about', (req, resp) => {
	resp.render('about');
});

// Use Routes
app.use('/ideas', ideasRoute);
app.use('/users', usersRoute);


app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
