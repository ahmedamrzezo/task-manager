const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
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
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

/**
 * generate authentication token
 * @param {id} userId
 * @returns {token}
 */

schema.methods.generateToken = async function () {
	const token = jwt.sign({ _id: this._id.toString() }, 'qwertyasdfgh', {
		expiresIn: '1h',
	});
	this.tokens = this.tokens.concat({ token });
	// await this.save();
	return token;
};

// validate user credentials
schema.statics.validateCredentials = async ({ email, password }) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Email does not exist, please sign up!');
	}

	const isValidPassword = await bcrypt.compare(password, user.password);

	if (isValidPassword) {
		return user;
	} else {
		throw new Error('Invalid Credentials!');
	}
};

// middle ware for hashing password before saving
schema.pre('save', async function (next) {
	const user = this;
	if (user.password) {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	}

	next();
});

const User = mongoose.model('User', schema);

module.exports = User;
