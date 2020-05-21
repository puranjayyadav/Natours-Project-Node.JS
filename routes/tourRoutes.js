const express = require('express');
const tourControllers = require('./../controllers/tourController');
const router = express.Router();
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes');

//router.param('id', tourControllers.checkID);

router.use('/:tourId/reviews', reviewRouter)
router.route('/top-5-cheap').get(tourControllers.aliasTopTours, tourControllers.getAllTours);
router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(authController.restrictTo('admin','lead-guide','guide'),tourControllers.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourControllers.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances)

router.route('/').get(tourControllers.getAllTours).post(authController.protect,authController.restrictTo('admin','lead-guide') ,tourControllers.createTour); 
router.route('/:id').get(tourControllers.getTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourControllers.deleteTour).patch(authController.restrictTo('admin','lead-guide'),tourControllers.updateTour);

module.exports = router;