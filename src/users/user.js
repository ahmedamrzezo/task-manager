const User = require('./models/user.model');
const HelperService = require('../utils/helper');

class UserService {
	static async creatUser(req, res) {
		const user = new User(req.body);

		try {
			await user.save();

			const token = await user.generateToken();

			HelperService.handleSuccess(res, { user, token }, 201);
		} catch (error) {
			HelperService.handleError(res, error);
		}
	}

	static async getUserProfile(req, res) {
		HelperService.handleSuccess(res, {
			user: req.user,
			expiresIn: req.expiresIn,
		});
	}

	static async updateUser(req, res) {
		const fields = Object.keys(req.body);
		const allowedFields = ['name', 'email', 'password'];
		const isValidUpdate = HelperService.validateUpdateFields(
			fields,
			allowedFields
		);

		if (!isValidUpdate) {
			return HelperService.handleError(res, {
				error: 'Invalid update field!',
			});
		}

		try {
			const user = req.user;

			fields.forEach((field) => {
				if (typeof req.body[field] === 'object') {
					const userOb = user.toObject();
					return (user[field] = { ...userOb[field], ...req.body[field] });
				}
				return (user[field] = req.body[field]);
			});
			// console.log(user);
			await user.save();

			HelperService.handleSuccess(res, user);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}

	static async deleteUser(req, res) {
		try {
			await req.user.remove();
			HelperService.handleSuccess(res, req.user);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}

	static async loginUser(req, res) {
		try {
			const user = await User.validateCredentials(req.body);

			const token = await user.generateToken();

			HelperService.handleSuccess(res, { user, token });
		} catch (error) {
			HelperService.handleError(res, error);
		}
	}

	static async logoutUser(req, res) {
		try {
			const currentToken = req.token;
			req.user.tokens = req.user.tokens.filter(
				(token) => token.token !== currentToken
			);

			await req.user.save();

			HelperService.handleSuccess(res, ' ', 200);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}
	static async logoutAll(req, res) {
		try {
			req.user.tokens = [];

			await req.user.save();

			HelperService.handleSuccess(res, req.user, 200);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}
}

module.exports = UserService;
