const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');

const router = express.Router();

// edit a booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const userID = req.user.id;
    const bookingId = parseInt(req.params.bookingId);
    const { startDate, endDate } = req.body;

    // booking not found
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // error response for editing a booking past end date
    if (new Date(booking.endDate) < new Date()) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    // check for proper auth, booking must belong to curr user
    if (userID !== booking.userId) {
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

    const existingBooking = await Booking.findAll({
        where: {
            // check for other bookings with similar spot ids
            spotId: booking.spotId,
            // where their booking id isn't the curr one provided or editing
            id: {
                [Op.ne]: bookingId
            }
        }
    });
    // iterate through existing bookings obj to compare dates
    for (let newBooking of existingBooking) {
        const existingStartDate = new Date(newBooking.startDate);
        const existingEndDate = new Date(newBooking.endDate);

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

    // update booking if curr user authorized and bookingId matches
    await booking.update({
        startDate,
        endDate
    });

    return res.status(200).json(booking);
});


// delete a booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const userID = req.user.id;
    const bookingId = parseInt(req.params.bookingId);

    // booking not found
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // check for proper auth, booking must belong to curr user or spot belongs to curr user
    const spot = await Spot.findByPk(booking.spotId);
    if (userID !== booking.userId && userID !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // error response for bookings that have started
    if (new Date(booking.startDate) < new Date()) {
        return res.status(403).json({message: "Bookings that have been started can't be deleted"});
    }

    // delete booking if curr user authorized
    await booking.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
});


module.exports = router;
