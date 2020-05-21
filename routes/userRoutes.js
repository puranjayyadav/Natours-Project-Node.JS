const express = require('express');
const userController = require('./../controllers/userController');
const authControllers = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);
router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

//Protect all routes after this middleware
router.use(authControllers.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authControllers.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.UpdateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authControllers.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
