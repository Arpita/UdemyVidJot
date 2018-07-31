module.exports = {
	ensureAuthenticated: function(req, resp, next) {
		if (req.isAuthenticated())
			return next();
		else {
			req.flash('error_msg', 'Not authorized');
			resp.redirect('/users/login');
		}
	}
}