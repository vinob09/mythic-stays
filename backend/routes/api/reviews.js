const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const router = express.Router();

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


// get all curr user reviews
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    if (user) {
        let reviews = await Review.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: {
                        exclude: ['description', 'createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: SpotImage,
                            attributes: ['url'],
                            where: {
                                preview: true
                            },
                            limit: 1
                        }
                    ]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        reviews = reviews.map(review => review.toJSON());

        // preview image data for spots
        for (let image of reviews) {
            if (image.Spot.SpotImages && image.Spot.SpotImages.length > 0) {
                image.Spot.previewImage = image.Spot.SpotImages[0].url;
            } else {
                image.Spot.previewImage = null;
            }
            delete image.Spot.SpotImages;
        }

        return res.status(200).json({ Reviews: reviews });
    }
});


// edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    // find review by reviewId
    const userReview = await Review.findByPk(reviewId);
    if (!userReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // check for proper auth, review must belong to curr user
    if (userId !== userReview.userId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await userReview.update({
        review,
        stars
    });

    return res.status(200).json(userReview);
});


// delete a review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { reviewId } = req.params;

    // review not found
    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // check for proper auth, review must belong to curr user
    if (userId !== review.userId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await review.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
});


// add image to Review based on Review id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const userID = req.user.id;
    const { reviewId } = req.params;
    const { url } = req.body;

    // review not found
    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // check for proper auth, review must belong to curr user
    if (userID !== review.userId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // check for max 10 images
    const maxImages = await ReviewImage.findAll({ where: { reviewId } });
    if (maxImages.length >= 10) {
        return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
    }

    const newImage = await ReviewImage.create({
        reviewId,
        url
    });

    return res.status(200).json({
        id: newImage.id,
        url: newImage.url
    });
});


module.exports = router;
