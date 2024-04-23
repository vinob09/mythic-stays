'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://example-img1.com'
      },
      {
        reviewId: 2,
        url: 'https://example-img2.com'
      },
      {
        reviewId: 3,
        url: 'https://example-img3.com'
      },
      {
        reviewId: 4,
        url: 'https://example-img4.com'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://example-img1.com', 'https://example-img2.com', 'https://example-img3.com', 'https://example-img4.com'] }
    }, {});
  }
};
