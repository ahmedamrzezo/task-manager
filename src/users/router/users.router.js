const express = require('express');
const router = new express.Router();

const userService = require('../user');

router.post('/users', userService.creatUser);
router.get('/users/:id', userService.getUserById);
router.patch('/users/:id', userService.updateUser);
router.delete('/users/:id', userService.deleteUser);

module.exports = router;
