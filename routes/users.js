const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

// Load User model
require('../models/User');
const User = mongoose.model('users');

// User login route
router.get('/login', (req, resp) => {
	resp.render('users/login');
});

// Login form post
router.post('/login', (req, resp, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, resp, next);
});

// User register route
router.get('/register', (req, resp) => {
	resp.render('users/register');
});

// Register post
router.post('/register', (req, resp) => {
	let errors = [];

	if (req.body.password != req.body.password2)
		errors.push({ text: 'Passwords do not match' });

	if (req.body.password.length < 4)
		errors.push({ text: 'Password must be at least four characcters' });

	if (errors.length > 0) {
		resp.render('users/register', {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		});
	} else {
		User.findOne({ email: req.body.email })
			.then(user => {
				if (user) {
					req.flash('error_msg', 'Email has already been registered.');
					resp.redirect('/users/login');
				} else {
					const newUser = new User({
						name: req.body.name,
						email: req.body.email,
						password: req.body.password
					});

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err)
								throw err;
							else {
								newUser.password = hash;

								newUser.save()
									.then(user => {
										req.flash('success_msg', 'You are now registered and can log in');
										resp.redirect('/users/login');
									})
									.catch(err => {
										console.log(err);
										return;
									});
							}
						});
					});
				}
			});

	}
});

// logout
router.get('/logout', (req, resp) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	resp.redirect('/users/login');
});

module.exports = router;