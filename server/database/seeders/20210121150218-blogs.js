module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'blogs',
    [
      {
        "author_id": 1,
        "name": "Cipromox"
      },
      {
        "author_id": 2,
        "name": "Steelfab"
      },
      {
        "author_id": 3,
        "name": "Ecraze"
      },
      {
        "author_id": 4,
        "name": "Manglo"
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('blogs', null, {}),
};
