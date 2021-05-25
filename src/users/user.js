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
			HelperService.handleError(req, res, error);
		}
	}

	static async getUsers(req, res) {
		try {
			const users = await User.find({});
			HelperService.handleSuccess(res, users);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async getUserById(req, res) {
		const _id = req.params.id;
		try {
			const user = await User.findById(_id);
			HelperService.handleSuccess(res, user);
		} catch (error) {
			HelperService.handleError(req, res, error);
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
			return HelperService.handleError(req, res, {
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
			HelperService.handleError(req, res, error);
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
			HelperService.handleError(req, res, error);
		}
	}

	static async loginUser(req, res) {
		try {
			const user = await User.validateCredentials(req.body);

			const token = await user.generateToken();

			HelperService.handleSuccess(res, { user, token });
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}
}

module.exports = UserService;
