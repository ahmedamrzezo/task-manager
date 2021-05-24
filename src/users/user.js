const User = require('./models/user.model');
const HelperService = require('../utils/helper');

class UserService {
	static async creatUser(req, res) {
		const user = new User(req.body);

		try {
			await user.save();
			HelperService.handleSuccess(req, res, user);
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
