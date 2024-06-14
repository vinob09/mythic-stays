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
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-1.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-1.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-1.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-1.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-1.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-2.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-2.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-2.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-2.png',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-3.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-3.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-3.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-3.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-3.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-4.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-4.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-4.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-4.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-4.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-4.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/kaer-morhen-5.png',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/rivendell-5.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/baldurs-gate-5.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/normandy-5.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/hobbit-5.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/corvo-bianco-5.png',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/mass-1.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/mass-2.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/mass-3.png',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/mass-4.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/mass-5.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/eso-1.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/eso-2.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/eso-3.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/eso-4.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/eso-5.png',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/yakuza-1.jpg',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/yakuza-2.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/yakuza-5.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/yakuza-3.jpg',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/yakuza-4.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/grommash-1.png',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/grommash-2.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/grommash-3.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/grommash-4.jpg',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://chansbucket.s3.us-east-2.amazonaws.com/Spots-Images/grommash-5.png',
        preview: false
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
