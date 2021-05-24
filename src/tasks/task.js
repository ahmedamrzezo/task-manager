const Task = require('./models/task.model');
const HelperService = require('../utils/helper');

class TaskService {
	static async createTask(req, res) {
		const newTask = new Task(req.body);
		try {
			const data = await newTask.save();
			HelperService.handleSuccess(req, res, data);
		} catch (error) {
			HelperService.handleError(res, error);
		}
	}

	static async getTasks(req, res) {
		try {
			const tasks = await Task.find({});
			HelperService.handleSuccess(req, res, tasks);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async getTaskById(req, res) {
		const _id = req.params.id;
		try {
			const task = await Task.findById(_id);
			HelperService.handleSuccess(req, res, task);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async updateTask(req, res) {
		const fields = Object.keys(req.body);
		const allowedFields = ['title', 'description', 'completed'];
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
			const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {
				lean: true,
				runValidators: true,
				new: true,
			});

			HelperService.handleSuccess(req, res, updatedTask);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}

	static async deleteTask(req, res) {
		const _id = req.params.id;

		try {
			const task = await Task.findByIdAndDelete(_id);
			HelperService.handleSuccess(req, res, task);
		} catch (error) {
			HelperService.handleError(req, res, error);
		}
	}
}

module.exports = TaskService;
