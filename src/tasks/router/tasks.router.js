const express = require('express');
const auth = require('../../middleware/auth');
const router = new express.Router();

const taskService = require('../task');

router.post('/tasks', auth, taskService.createTask);
router.get('/tasks', auth, taskService.getTasks);
router.get('/tasks/:id', auth, taskService.getTaskById);
router.patch('/tasks/:id', auth, taskService.updateTask);
router.delete('/tasks/:id', auth, taskService.deleteTask);

module.exports = router;
