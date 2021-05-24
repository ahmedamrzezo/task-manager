const mongoose = require('mongoose');

const validator = require('validator');

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid');
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
			if (value.match(/password/i)) {
				throw new Error('Your password mustn\'t contain "password" keyword!');
			}
			if (!validator.isLength(value, { min: 6 })) {
				throw new Error('Your password must be more than 6 chars!');
			}
		},
	},
});

module.exports = User;
