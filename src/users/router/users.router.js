const express = require('express');
const auth = require('../../middleware/auth');
const router = new express.Router();

const userService = require('../user');

router.post('/users', userService.creatUser);
router.post('/users/login', userService.loginUser);
router.get('/users/me', auth, userService.getUserProfile);
router.get('/users/:id', userService.getUserById);
router.patch('/users/:id', userService.updateUser);
router.delete('/users/:id', userService.deleteUser);
router.post('/users/logout', auth, userService.logoutUser);
router.post('/users/logoutAll', auth, userService.logoutAll);

module.exports = router;
