'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '87 Gwenllech River Road',
        city: 'Kaer Morhen Valley',
        state: 'Hertch',
        country: 'Kaedwen',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'Kaer Morhen Fortress',
        description: 'A private room overlooking the witcher training grounds',
        price: 98.99
      },
      {
        ownerId: 2,
        address: '198 East Road',
        city: 'Rivendell',
        state: 'Eastern Eriador',
        country: 'Middle-earth',
        lat: 17.7685328,
        lng: -13.4462327,
        name: 'Rivendell Villas',
        description: 'Peaceful and secluded villa in Rivendell, tucked deep in the mountains',
        price: 182
      },
      {
        ownerId: 3,
        address: "3 Baldur's Way",
        city: "Baldur's Gate",
        state: "Sword Coast",
        country: "Western Heartlands",
        lat: -2.2645252,
        lng: 12.6430347,
        name: 'The Elf Song Tavern and Inn',
        description: "Breathtaking suite down, down, down by the river in Baldur's Gate",
        price: 42.50
      },
      {
        ownerId: 4,
        address: 'Dock 422 C-Sec',
        city: 'Citadel',
        state: 'Earth',
        country: 'The Widow System',
        lat: 29.2245456,
        lng: -111.4845358,
        name: 'SSV Normandy',
        description: 'Interstellar nights upon the Normandy',
        price: 1029.33
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
