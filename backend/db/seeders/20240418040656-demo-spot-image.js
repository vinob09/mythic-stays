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
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-1.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-1.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-1.jpeg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-1.jpeg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-1.jpeg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-1.jpeg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-2.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-2.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-2.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-2.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-2.jpeg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-2.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-3.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-3.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-3.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-3.jpeg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-3.jpeg',
        preview: false
      },
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
