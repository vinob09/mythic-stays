const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, Booking, User, ReviewImage } = require('../../db/models');

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
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .optional()
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

const validateQueries = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Size must be between 1 and 20'),
    check('minLat')
        .optional()
        .isFloat({ min: -90 })
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional()
        .isFloat({ max: 90 })
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional()
        .isFloat({ min: -180 })
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({ max: 180 })
        .withMessage('Maxiumum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maxiumum price must be greater than or equal to 0'),
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


// get all spot reviews by id
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    return res.status(200).json({ Reviews: reviews });
});


// get all spot bookings based on id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { spotId } = req.params;

    // spot not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // if request is made from owner of spot
    if (userId === spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        const formattedBookings = bookings.map(booking => {
            const bookingJSON = booking.toJSON();

            return {
                User: {
                    ...bookingJSON.User
                },
                id: bookingJSON.id,
                spotId: bookingJSON.spotId,
                userId: bookingJSON.userId,
                startDate: bookingJSON.startDate,
                endDate: bookingJSON.endDate,
                createdAt: bookingJSON.createdAt,
                updatedAt: bookingJSON.updatedAt
            }
        });

        return res.status(200).json({ Bookings: formattedBookings });
    }

    // if request is not made from owner of spot
    if (userId !== spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        });

        return res.status(200).json({ Bookings: bookings });
    }
});


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
            } else {
                spotJSON.avgRating = null;
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
    } else {
        spot.numReviews = null;
        spot.avgRating = null;
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
router.get('/', validateQueries, async (req, res, next) => {
    // query filters
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page) || 1;
    size = parseInt(size) || 20;
    minLat = parseFloat(minLat);
    maxLat = parseFloat(maxLat);
    minLng = parseFloat(minLng);
    maxLng = parseFloat(maxLng);
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    if (isNaN(minLat)) minLat = undefined;
    if (isNaN(maxLat)) maxLat = undefined;
    if (isNaN(minLng)) minLng = undefined;
    if (isNaN(maxLng)) maxLng = undefined;
    if (isNaN(minPrice)) minPrice = undefined;
    if (isNaN(maxPrice)) maxPrice = undefined;

    // pagination
    let limit;
    let offset;
    if (page >= 1 && size <= 20) {
        limit = size;
        offset = size * (page - 1)
    } else {
        limit = 20
    }

    // return specified user queries
    let where = {};
    // lng
    if (minLat !== undefined && maxLat !== undefined) where.lat = { [Op.between]: [minLat, maxLat] };
    if (minLat !== undefined && maxLat === undefined) where.lat = { [Op.gte]: minLat };
    if (minLat === undefined && maxLat !== undefined) where.lat = { [Op.lte]: maxLat };
    // lng
    if (minLng !== undefined && maxLng !== undefined) where.lng = { [Op.between]: [minLng, maxLng] };
    if (minLng !== undefined && maxLng === undefined) where.lng = { [Op.gte]: minLng };
    if (minLng === undefined && maxLng !== undefined) where.lng = { [Op.lte]: maxLng };
    // price
    if (minPrice !== undefined && maxPrice !== undefined) where.price = { [Op.between]: [minPrice, maxPrice] };
    if (minPrice !== undefined && maxPrice === undefined) where.price = { [Op.gte]: minPrice };
    if (minPrice === undefined && maxPrice !== undefined) where.price = { [Op.lte]: maxPrice };


    const spots = await Spot.findAll({
        where,
        include: [
            {
                model: Review,
                attributes: ['stars'],
                required: false
            },
            {
                model: SpotImage,
                attributes: ['url'],
                where: {
                    preview: true
                },
                limit: 1,
                required: false
            }
        ],
        limit,
        offset
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
        } else {
            spotJSON.avgRating = null;
        }

        // preview image data
        if (spotJSON.SpotImages && spotJSON.SpotImages.length > 0) {
            spotJSON.previewImage = spotJSON.SpotImages[0].url;
        } else {
            spotJSON.previewImage = null;
        }

        delete spotJSON.Reviews;
        delete spotJSON.SpotImages;

        return spotJSON
    });

    return res.status(200).json({ Spots: formattedSpots, page, size });
});


module.exports = router;
