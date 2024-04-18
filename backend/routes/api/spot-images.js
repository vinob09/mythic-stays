const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { imageId } = req.params;

    // find image by imageId and include Spot model
    const image = await SpotImage.findByPk(imageId, {
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    });

    // image not found
    if (!image) {
        return res.status(404).json({message: "Spot Image couldn't be found"});
    }

    // check for proper auth, spot must belong to curr user
    if (userId !== image.Spot.ownerId) {
        return res.status(403).json({message: 'Forbidden'});
    }

    await image.destroy();

    return res.status(200).json({message: 'Successfully deleted'});
});


module.exports = router;
