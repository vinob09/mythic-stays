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
        startDate: '1603-11-19',
        endDate: '1603-11-29'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '1302-04-05',
        endDate: '1302-04-10'
      },
      {
        spotId: 3,
        userId: 4,
        startDate: '1719-06-23',
        endDate: '1719-06-25'
      },
      {
        spotId: 4,
        userId: 1,
        startDate: '3025-02-14',
        endDate: '3025-03-11'
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
