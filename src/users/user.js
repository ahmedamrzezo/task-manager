const User = require('./models/user.model');
const HelperService = require('../utils/helper');

class UserService {
	static async creatUser(req, res) {
		const user = new User(req.body);

		try {
			const token = await user.generateToken();
			await user.save();

			HelperService.handleSuccess(res, { user, token }, 201);
		} catch (error) {
			HelperService.handleError(res, error);
		}
	}

	static async getUsers(req, res) {
		try {
			const users = await User.find({});
			HelperService.handleSuccess(res, users);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}

	static async getUserById(req, res) {
		const _id = req.params.id;
		try {
			const user = await User.findById(_id);

			if (!user) {
				return HelperService.handleError(
					res,
					{ error: 'User was not found!' },
					404
				);
			}

			HelperService.handleSuccess(res, user);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
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

		const _id = req.params.id;

		try {
			const user = await User.findById(_id);

			fields.forEach((field) => (user[field] = req.body[field]));

			await user.save();

			HelperService.handleSuccess(res, user);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}

	static async deleteUser(req, res) {
		const _id = req.params.id;

		try {
			if (_id == 'all') {
				await User.deleteMany({});
				HelperService.handleSuccess(res, []);
			} else {
				const user = await User.findByIdAndDelete(_id);
				HelperService.handleSuccess(res, user);
			}
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
}

module.exports = UserService;
