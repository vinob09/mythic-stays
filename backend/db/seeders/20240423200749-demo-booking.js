'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-11-19',
        endDate: '2024-11-29'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-04-05',
        endDate: '2024-04-10'
      },
      {
        spotId: 3,
        userId: 4,
        startDate: '2024-06-23',
        endDate: '2024-06-25'
      },
      {
        spotId: 4,
        userId: 1,
        startDate: '2024-02-14',
        endDate: '2025-03-11'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
