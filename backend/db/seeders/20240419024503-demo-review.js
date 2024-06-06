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
        review: 'Great views of the mountains! Reminds me of the time over the Misty Mountains back in my homeland. Ah, the memories. Also cool to see all of the witchers in training.',
        stars: 4,
        createdAt: '2019-01-05 07:25:29.810 +00:00'
      },
      {
        userId: 3,
        spotId: 2,
        review: "Lovely time spent as I finished my book titled There and Back Again, a Hobbit's Tale. Thanks for the amazing hospitatlity and serene quiet that I so desired.",
        stars: 5,
        createdAt: '2019-02-15 11:45:19.610 +00:00'
      },
      {
        userId: 4,
        spotId: 3,
        review: 'The river view was a sight to see, although there was a bit of a ruckus in the bar on one of our stays. Despite that, the town was lively and there seemed to always be something to do.',
        stars: 3,
        createdAt: '2019-03-20 15:30:59.410 +00:00'
      },
      {
        userId: 1,
        spotId: 4,
        review: 'The room and spaceship was extremely impressive, but unfortunately, Reapers boarded the ship. Had to cut the trip short. Wished we had more time to explore the ship and its state-of-the-art technologies!',
        stars: 2,
        createdAt: '2019-04-10 09:00:49.210 +00:00'
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Extremely charming fortress! Would definitely be back again. Perhaps with an companion? Regardless, fast traveling by teleportation would be best as the trek is quite far.',
        stars: 5,
        createdAt: '2019-05-25 13:20:39.010 +00:00'
      },
      {
        userId: 4,
        spotId: 2,
        review: "Nice and quiet, just how I like it! Such a change of pace from my normal life back on the Citadel. Although nothing can compare to my captains quarters on the Normandy.",
        stars: 4,
        createdAt: '2019-06-05 17:40:28.810 +00:00'
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Strange noises kept us up all night! Will not be back. Would give a negative star if I could. I would have helped the adventuring party with their investigation but they insisted on looking into every single barrel and crate around and rummaging in their inventory, it became tiresome to watch!',
        stars: 1,
        createdAt: '2019-07-15 21:00:18.610 +00:00'
      },
      {
        userId: 2,
        spotId: 4,
        review: 'Too many flip-and-burns. The room was nice at least! Wished I would have been more prepared for the galaxy-spins....such is outer space.',
        stars: 3,
        createdAt: '2019-08-25 01:20:08.410 +00:00'
      },
      {
        userId: 2,
        spotId: 3,
        review: 'What a wild and fascinating land! It sure beats my journey on Middle-earth. To say that the only evil here is an octopus, that is childs play!',
        stars: 5,
        createdAt: '2019-09-10 05:45:59.210 +00:00'
      },
      {
        userId: 3,
        spotId: 6,
        review: 'An enchanting vineyard with all the luxuries and accommodations a fine wizard like myself would enjoy. The wine was excellent and I shall buy it by the barrel to bring to my home in Waterdeep!',
        stars: 5,
        createdAt: '2020-05-10 05:45:59.210 +00:00'
      }
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
