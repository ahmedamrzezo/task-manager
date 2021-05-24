const mongoose = require('mongoose');

const validator = require('validator');

const errors = require('../utils/helper');

const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(connectionURL, {
	useUnifiedTopology: true,
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
});
