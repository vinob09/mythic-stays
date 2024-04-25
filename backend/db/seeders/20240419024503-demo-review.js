'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        review: 'Great views of the mountains! Also cool to see all of the witchers in training.',
        stars: 4
      },
      {
        userId: 3,
        spotId: 2,
        review: "Lovely time spent as I finished my book titled There and Back Again, a Hobbit's Tale.",
        stars: 5
      },
      {
        userId: 4,
        spotId: 3,
        review: 'The river view was a sight to see, although there was a bit of a ruckus in the bar on one of our stays.',
        stars: 3
      },
      {
        userId: 1,
        spotId: 4,
        review: 'The room and spaceship was extremely impressive, but unfortunately, Reapers boarded the ship. Had to cut the trip short.',
        stars: 2
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Extremely charming fortress!',
        stars: 5
      },
      {
        userId: 4,
        spotId: 2,
        review: "Nice and quiet, just how I like it!",
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Strange noises kept us up all night! Will not be back.',
        stars: 1
      },
      {
        userId: 2,
        spotId: 4,
        review: 'Too many flip-and-burns. The room was nice at least!',
        stars: 3
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
