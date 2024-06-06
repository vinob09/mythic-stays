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
        url: '../public/assets/kaer-morhen-1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: '../public/assets/rivendell-1.png',
        preview: true
      },
      {
        spotId: 3,
        url: '../public/assets/baldurs-gate-1.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: '../public/assets/normandy-1.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: '../public/assets/hobbit-1.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: '../public/assets/corvo-bianco-1.png',
        preview: true
      },
      {
        spotId: 1,
        url: '../public/assets/kaer-morhen-2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: '../public/assets/rivendell-2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: '../public/assets/baldurs-gate-2.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: '../public/assets/normandy-2.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: '../public/assets/hobbit-2.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: '../public/assets/corvo-bianco-2.png',
        preview: false
      },
      {
        spotId: 1,
        url: '../public/assets/kaer-morhen-3.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: '../public/assets/rivendell-3.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: '../public/assets/baldurs-gate-3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: '../public/assets/normandy-3.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: '../public/assets/hobbit-3.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: '../public/assets/corvo-bianco-3.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: '../public/assets/kaer-morhen-4.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: '../public/assets/rivendell-4.png',
        preview: false
      },
      {
        spotId: 3,
        url: '../public/assets/baldurs-gate-4.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: '../public/assets/normandy-4.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: '../public/assets/hobbit-4.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: '../public/assets/corvo-bianco-4.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: '../public/assets/kaer-morhen-5.png',
        preview: false
      },
      {
        spotId: 2,
        url: '../public/assets/rivendell-5.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: '../public/assets/baldurs-gate-5.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: '../public/assets/normandy-5.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: '../public/assets/hobbit-5.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: '../public/assets/corvo-bianco-5.png',
        preview: false
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
