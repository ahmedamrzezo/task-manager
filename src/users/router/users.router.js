const express = require('express');
const multer = require('multer');
const auth = require('../../middleware/auth');
const HelperService = require('../../utils/helper');
const User = require('../models/user.model');
const router = new express.Router();

const userService = require('../user');

const uploadAvatar = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (file.mimetype.split('/')[0] == 'image') {
			return cb(undefined, true);
		}
		return cb(new Error('Invalid image extension'), false);
	}
});

router.post('/users', userService.creatUser);
router.post('/users/login', userService.loginUser);
router.get('/users/me', auth, userService.getUserProfile);
router.patch('/users/me', auth, userService.updateUser);
router.delete('/users/me', auth, userService.deleteUser);
router.post('/users/logout', auth, userService.logoutUser);
router.post('/users/logoutAll', auth, userService.logoutAll);

// image upload
router.post(
	'/users/me/avatar',
	auth,
	uploadAvatar.single('avatar'),
	async (req, res) => {
		const user = req.user;

		user.avatar = req.file.buffer;

		await user.save();

		HelperService.handleSuccess(res, ' ', 200);
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	});

router.delete(
	'/users/me/avatar',
	auth,
	uploadAvatar.single('avatar'),
	async (req, res) => {
		const user = req.user;

		user.avatar = '';

		await user.save();

		HelperService.handleSuccess(res, ' ', 200);
	});


router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error('No user found');
		}

		res.set('Content-Type', 'image/jpg');
		res.send(user.avatar);
	} catch (error) {
		HelperService.handleError(res, ' ', 200);
	}
});

module.exports = router;
