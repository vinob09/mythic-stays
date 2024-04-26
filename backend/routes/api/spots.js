const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, Booking, User } = require('../../db/models');

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
        .withMessage('Name must be less than 50 characters'),
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


// get all curr user spots
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const spots = await Spot.findAll({
            where: {
                ownerId: user.id
            },
            include: [
                {
                    model: Review,
                    attributes: ['stars']
                },
                {
                    model: SpotImage,
                    attributes: ['url'],
                    where: {
                        preview: true
                    },
                    limit: 1
                }
            ]
        });

        // find avg rating of stars for each spot and include 1 preview image url
        // format using toJSON
        // check for cases where no preview is provided
        const formattedSpots = spots.map(spot => {
            const spotJSON = spot.toJSON();

            // avg rating data
            let totalStars = 0;
            let reviewCount = 0;
            if (spotJSON.Reviews && spotJSON.Reviews.length > 0) {
                // iterate over each Review obj
                for (let review of spotJSON.Reviews) {
                    totalStars += review.stars;
                    reviewCount++;
                }
                spotJSON.avgRating = totalStars / reviewCount;
            }

            // preview image data
            if (spotJSON.SpotImages && spotJSON.SpotImages.length > 0) {
                spotJSON.previewImage = spotJSON.SpotImages[0].url;
            } else {
                spotJSON.previewImage = null;
            }

            delete spotJSON.Reviews;
            delete spotJSON.SpotImages;

            return spotJSON;
        });

        return res.status(200).json({ Spots: formattedSpots });
    }
});


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


// add booking to Spot based on Spot id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const spotId = parseInt(req.params.spotId);
    const { startDate, endDate } = req.body;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // check for proper auth, spot must NOT belong to curr user
    if (userId === spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // check for body validation errors
    const invalidStartDate = new Date(startDate);
    const invalidEndDate = new Date(endDate);

    if (invalidStartDate < new Date()) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: {
                startDate: 'startDate cannot be in the past'
            }
        });
    }
    if (invalidEndDate <= new Date(invalidStartDate)) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: {
                endDate: 'endDate cannot be on or before startDate'
            }
        });
    }

    // check for booking conflict
    const requestedStartDate = new Date(startDate);
    const requestedEndDate = new Date(endDate);

    const existingBooking = await Booking.findAll({ where: { spotId } });
    // iterate through existing bookings obj to compare dates
    for (let booking of existingBooking) {
        const existingStartDate = new Date(booking.startDate);
        const existingEndDate = new Date(booking.endDate);

        if (existingStartDate <= requestedStartDate && requestedStartDate <= existingEndDate) {
            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                    startDate: 'Start date conflicts with an existing booking'
                }
            });
        }
        if (existingStartDate <= requestedEndDate && requestedEndDate <= existingEndDate) {
            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                    endDate: 'End date conflicts with an existing booking'
                }
            });
        }
        if (requestedStartDate <= existingStartDate && requestedEndDate >= existingEndDate) {
            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                    startDate: 'Start date conflicts with an existing booking'
                }
            });
        }
    }

    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    });

    return res.status(200).json(newBooking);
});


// get spot details from id
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review,
                attributes: ['id', 'stars']
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    // spot not found
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // num reviews and avg rating data
    let totalStars = 0;
    let reviewCount = 0;
    if (spot.Reviews && spot.Reviews.length > 0) {
        // iterate over each Review obj
        for (let review of spot.Reviews) {
            totalStars += review.stars;
            reviewCount++;
        }
        spot.numReviews = reviewCount;
        spot.avgRating = totalStars / reviewCount;
    }
    delete spot.Reviews;

    const formattedSpot = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: spot.numReviews,
        avgStarRating: spot.avgRating,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner
    }

    return res.status(200).json(formattedSpot);
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


// get all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url'],
                where: {
                    preview: true
                },
                limit: 1
            }
        ]
    });

    // find avg rating of stars for each spot and include 1 preview image url
    // and format it using toJSON
    // check for cases where no preview is provided
    const formattedSpots = spots.map(spot => {
        const spotJSON = spot.toJSON();

        // avg rating data
        let totalStars = 0;
        let reviewCount = 0;
        if (spotJSON.Reviews && spotJSON.Reviews.length > 0) {
            // iterate over each Review obj
            for (let review of spotJSON.Reviews) {
                totalStars += review.stars;
                reviewCount++;
            }
            spotJSON.avgRating = totalStars / reviewCount;
        }

        // preview image data
        if (spotJSON.SpotImages && spotJSON.SpotImages.length > 0) {
            spotJSON.previewImage = spotJSON.SpotImages[0].url;
        } else {
            spotJSON.previewImage = null;
        }

        delete spotJSON.Reviews;
        delete spotJSON.SpotImages;

        return spotJSON;
    });

    return res.status(200).json({ Spots: formattedSpots });
});


module.exports = router;
