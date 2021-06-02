const jwt = require('jsonwebtoken');
const User = require('../users/models/user.model');
const HelperService = require('../utils/helper');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});

		if (!user) {
			throw new Error('You are not authorized');
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
