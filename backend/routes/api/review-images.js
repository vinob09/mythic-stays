const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');

const router = express.Router();

// delete a Review image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const userID = req.user.id;
    const { imageId } = req.params;

    // find image by imageId and include Review model
    const image = await ReviewImage.findByPk(imageId, {
        include: {
            model: Review,
            attributes: ['userId']
        }
    });

    // image not found
    if (!image) {
        return res.status(404).json({message: "Review Image couldn't be found"});
    }

    // check for proper auth, review must belong to curr user
    if (userID !== image.Review.userId) {
        return res.status(403).json({message: 'Forbidden'});
    }

    await image.destroy();

    return res.status(200).json({message: 'Successfully deleted'});
});


module.exports = router;
