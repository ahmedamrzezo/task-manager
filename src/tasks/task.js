const Task = require('./models/task.model');
const HelperService = require('../utils/helper');

class TaskService {
	static async createTask(req, res) {
		const newTask = new Task({
			...req.body,
			createdBy: req.user._id,
		});

		try {
			const data = await newTask.save();
			HelperService.handleSuccess(res, data);
		} catch (error) {
			HelperService.handleError(res, error);
		}
	}

	static async getTasks(req, res) {
		const match = {};
		const completed = req.query.completed;
		const limit = +req.query.limit;
		const skip = +req.query.skip;
		const sort = {};

		if (completed) {
			match.completed = completed === 'true';
		}

		if (req.query.sortBy) {
			const sortStr = req.query.sortBy.split(':');
			sort[sortStr[0]] = sortStr[1] === 'desc' ? -1 : 1;

		}
		try {
			await req.user.populate({
				path: 'tasks',
				match,
				options: {
					limit,
					skip,
					sort
				}
			}).execPopulate();
			HelperService.handleSuccess(res, req.user.tasks);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}

	static async getTaskById(req, res) {
		const _id = req.params.id;
		try {
			const task = await Task.findOne({ _id, createdBy: req.user._id });
			HelperService.handleSuccess(res, task);
		} catch (error) {
			HelperService.handleError(res, error, 500);
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
			return HelperService.handleError(res, {
				error: 'Invalid update field!',
			});
		}

		const _id = req.params.id;
		try {
			const task = await Task.findOne({ _id, createdBy: req.user._id });

			if (task) {
				fields.forEach((field) => (task[field] = req.body[field]));
				await task.save();
			}

			HelperService.handleSuccess(res, task);
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}

	static async deleteTask(req, res) {
		const _id = req.params.id;

		try {
			let task;
			if (_id === 'all') {
				await Task.deleteMany({ createdBy: req.user._id });
			} else {
				task = await Task.findOneAndDelete({
					_id,
					createdBy: req.user._id,
				});
			}
			HelperService.handleSuccess(res, task || ' ');
		} catch (error) {
			HelperService.handleError(res, error, 500);
		}
	}
}

module.exports = TaskService;
