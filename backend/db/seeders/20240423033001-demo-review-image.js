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
      {
        reviewId: 5,
        url: 'https://example-img5.com'
      },
      {
        reviewId: 6,
        url: 'https://example-img6.com'
      },
      {
        reviewId: 7,
        url: 'https://example-img7.com'
      },
      {
        reviewId: 8,
        url: 'https://example-img8.com'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
