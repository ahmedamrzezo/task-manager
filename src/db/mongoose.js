const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB, {
	useUnifiedTopology: true,
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
});
