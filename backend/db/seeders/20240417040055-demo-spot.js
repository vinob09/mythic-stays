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
        description: 'A private room overlooking the witcher training grounds. Full suite of alchemy stations. Access to the castle grounds and lands beyond. Just a word of warning though, there has been talk of a Royal Wyvern flying about so proceed at your own risk.',
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
        description: 'Peaceful and secluded villa in Rivendell, tucked deep in the mountains. All villas come with meals and daily, fresh lembas bread. Explore our gardens, enjoy the serenity of the waterfall.',
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
        description: "Breathtaking suite down, down, down by the river in Baldur's Gate! We have been operating the inn since 1456 and have hosted many different guests from all across the lands. There are nightly events down at the bar should you wish to partake in them.",
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
        description: 'Interstellar nights upon the Normandy. The Captains Quarters is fully stocked and provides the best view of the stars. Meals will be provided free of charge down in the galley. Please be mindful of the other guests that may be on board!',
        price: 1029.33
      },
      {
        ownerId: 2,
        address: '39 Hobbit Way',
        city: 'Hobbiton',
        state: 'The Shire',
        country: 'Middle-earth',
        lat: 19.3225449,
        lng: -11.4348338,
        name: `A Hobbit's Stay`,
        description: 'Cozy, fireside nights in the Shire! Fireworks show included! This hobbit home is perfect for those that want to get away from any visitors or distant relations you may have. Tea and various cakes are baked fresh daily and provided to the home.',
        price: 42.00
      },
      {
        ownerId: 1,
        address: '3 Corvo Bianco Estates',
        city: 'Sangreal Valley',
        state: 'Toussaint',
        country: 'Sansretour Valley',
        lat: 28.6525493,
        lng: -120.4649397,
        name: `Corvo Bianco Vineyards`,
        description: `Enjoy our award-winning wine and the estate's luxuries in the heart of Toussaint. This vineyard includes a majordomo that will assist you throughout your stay. We have spacious stables to accomodate your horse should you arrive on horseback.`,
        price: 182.50
      },
      {
        ownerId: 4,
        address: '2 Anderson Way',
        city: 'Silversun Strip',
        state: 'Citadel',
        country: 'The Widow System',
        lat: 32.6546493,
        lng: -10.4449397,
        name: `Tiberius Towers Apartment`,
        description: `This grand apartment suite is equipped with a large seating area, perfect for celebrating your victories, along with a sauna and fully functional gym should you feel the need to let off some steam. Kitchen is fully-stocked and available for your use.`,
        price: 250
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
