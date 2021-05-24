const express = require('express');
const router = new express.Router();

const taskService = require('../task');

router.post('/tasks', taskService.createTask);
router.get('/tasks', taskService.getTasks);
router.get('/tasks/:id', taskService.getTaskById);
router.patch('/tasks/:id', taskService.updateTask);
router.delete('/tasks/:id', taskService.deleteTask);

module.exports = router;
