const mongoose = require('mongoose');

// const validator = require('validator');

const Task = mongoose.model('Task', {
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
});

module.exports = Task;
