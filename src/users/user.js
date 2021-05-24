const User = require('./models/user.model');
const HelperService = require('../utils/helper');

class UserService {
	static async creatUser(req, res) {
		const userData = req.body;
		if (userData.password) {
			const saltRounds = 10;
			userData.password = await bcrypt.hash(userData.password, saltRounds);
		}

		const user = new User(userData);

		try {
			await user.save();
			HelperService.handleSuccess(req, res, user);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async getUsers(req, res) {
		try {
			const users = await User.find({});
			HelperService.handleSuccess(req, res, users);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async getUserById(req, res) {
		const _id = req.params.id;
		try {
			const user = await User.findById(_id);
			HelperService.handleSuccess(req, res, user);
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
			const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
				lean: true,
				new: true,
				runValidators: true,
			});
			HelperService.handleSuccess(req, res, updatedUser);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async deleteUser(req, res) {
		const _id = req.params.id;

		try {
			const user = await User.findByIdAndDelete(_id);
			HelperService.handleSuccess(req, res, user);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}
}

module.exports = UserService;
