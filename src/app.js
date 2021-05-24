const express = require('express');

// connect mongoose db
require('./db/mongoose');

const userRouter = require('./users/router/users.router');

const taskRouter = require('./tasks/router/tasks.router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// users api
app.use(userRouter);

// tasks api
app.use(taskRouter);

app.listen(port, () => {
	console.log('Server Connected on port', port);
});
