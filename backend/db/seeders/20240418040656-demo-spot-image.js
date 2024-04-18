'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example-img1.com',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://example-img2.com',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://example-img3.com',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://example-img4.com',
        preview: false
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
