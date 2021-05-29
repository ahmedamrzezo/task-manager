const jwt = require('jsonwebtoken');
const User = require('../users/models/user.model');
const HelperService = require('../utils/helper');

const auth = async (req, res, next) => {
	const token = req.header('Authorization').replace('Bearer ', '');
	try {
		const decoded = jwt.verify(token, 'qwertyasdfgh');

		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});

		if (!user) {
			HelperService.handleError(res, { error: 'You are not authorized' }, 401);
		}

		req.token = token;
		req.user = user;
		req.expiresIn = decoded.exp;

		next();
	} catch (error) {
		HelperService.handleError(res, { error }, 401);
	}
};

module.exports = auth;
