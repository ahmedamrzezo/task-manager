const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
	name: {
		type: {
			first: {
				type: String,
				required: true,
				trim: true,
			},
			last: {
				type: String,
				required: true,
				trim: true,
			},
		},
		required: true,
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
			if (
				!validator.isLength(value, {
					min: 6,
				})
			) {
				throw new Error('Your password must be more than 6 chars!');
			}
		},
	},
	tokens: [{
		token: {
			type: String,
			required: true,
		},
	}, ],
}, {
	timestamps: true,
});

/**
 * create virtual for tasks to be linked with user
 */
schema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'createdBy',
});

/**
 * generate authentication token
 * @param {id} userId
 * @returns {token}
 */

schema.methods.generateToken = async function () {
	const user = this;
	const token = jwt.sign({
			_id: user._id.toString(),
		},
		'qwertyasdfgh', {
			expiresIn: '2h',
		}
	);
	user.tokens = user.tokens.concat({
		token,
	});
	await user.save();
	return token;
};

schema.virtual('fullName').get(function () {
	return `${this.name.first} ${this.name.last}`;
});

schema.methods.toJSON = function () {
	const user = this.toObject({
		virtuals: true,
	});

	delete user.password;
	delete user.tokens;
	delete user.name;
	delete user._id;
	delete user.__v;

	return user;
};

// validate user credentials
schema.statics.validateCredentials = async ({
	email,
	password
}) => {
	const user = await User.findOne({
		email,
	});

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
	if (user.isModified('password')) {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	}

	next();
});

/**
 * delete user tasks when the user is deleted
 */

schema.pre('remove', async function (next) {
	const user = await this.populate('tasks').execPopulate();
	const promises = user.tasks.map((task) =>
		task.deleteOne({
			_id: task._id,
		})
	);

	await Promise.all(promises);

	next();
});

const User = mongoose.model('User', schema);

module.exports = User;