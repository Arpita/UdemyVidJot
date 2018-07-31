const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Idea index page
router.get('/', (req, resp) => {
	Idea.find({ user: req.user.id })
		.sort({date: 'desc'})
		.then(ideas => {	
			resp.render('ideas/index', {
				ideas: ideas
			});
		});
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, resp) => {
	resp.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, resp) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		if (idea.user != req.user.id) {
			req.flash('error_msg', 'Not authorized');
			resp.redirect('/ideas');
		} else {
			resp.render('ideas/edit', {
				idea: idea
			});
		}
	});
});

// Process Form
router.post('/', ensureAuthenticated, (req, resp, next) => {
	let errors = [];

	if (!req.body.title)
		errors.push({ text: 'Please add a title' });
	if (!req.body.details)
		errors.push({ text: 'Please add some details' });

	if (errors.length > 0) {
		resp.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newIdea = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		};
		new Idea(newIdea)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Video Idea Added Successfully');
				resp.redirect('/ideas');
			});
	}
});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, resp) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				resp.redirect('/ideas');
			});
	});
});

// Delete idea
router.delete('/:id', ensureAuthenticated, (req, resp) => {
	Idea.remove({_id: req.params.id})
		.then(() => {
			req.flash('success_msg', 'Video Idea Removed Successfully');
			resp.redirect('/ideas');
		});
});


module.exports = router;