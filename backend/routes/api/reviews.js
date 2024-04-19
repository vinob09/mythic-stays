const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');

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

// edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    // find review by reviewId and include Spot model
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

    return res.status(200).json({message: 'Successfully deleted'});
});


module.exports = router;
