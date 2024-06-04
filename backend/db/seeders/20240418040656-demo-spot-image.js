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
        url: 'https://imgur.com/Nlsg6UU',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgur.com/zz8vYpX',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://imgur.com/yP2E3PR',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://imgur.com/YxzWPH1',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/vu9Pv2o',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/RJv39vN',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://imgur.com/0fTmYCl',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://imgur.com/AhRYzB6',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://www.gematsu.com/wp-content/uploads/2023/06/Baldurs-Gate-III_2023_06-11-23_002-1024x576.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://imgur.com/BdLTh6r',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://imgur.com/DXuTywE',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://imgur.com/Np42bcy',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://imgur.com/53Ur4MH',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://imgur.com/9GYoPsA',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://www.gematsu.com/wp-content/uploads/2023/06/Baldurs-Gate-III_2023_06-11-23_003.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://imgur.com/2dyVT0K',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://imgur.com/GKxyUHh',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://imgur.com/qJxAHCi',
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
