const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
}, {
	timestamps: true
});

const Task = mongoose.model('Task', schema)

module.exports = Task;