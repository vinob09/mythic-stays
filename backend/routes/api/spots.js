const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be 50 characters or less'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isFloat({ min: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


// add image to Spot based on Spot id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // check for proper auth, spot must belong to curr user
    if (userId !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const newImage = await SpotImage.create({
        spotId,
        url,
        preview
    });

    return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    });
});


// add review to Spot based on Spot id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const userId = req.user.id;
    const spotId = parseInt(req.params.spotId);
    const { review, stars } = req.body;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // check for existing review from curr user for this particular Spot
    const existingReview = await Review.findOne({ where: { userId, spotId } });
    if (existingReview) {
        return res.status(500).json({ message: 'User already has a review for this spot' });
    }

    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    });

    return res.status(201).json(newReview);
});


// edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const userId = req.user.id;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // check for proper auth, spot must belong to curr user
    if (userId !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // update spot if curr user authorized and spotId matches
    await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.status(200).json(spot);
});


// delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { spotId } = req.params;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // check for proper auth, spot must belong to curr user
    if (userId !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // delete spot if curr user authorized and spot matches
    await spot.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
});


// create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.status(201).json(newSpot);
});


module.exports = router;
