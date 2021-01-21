module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Blogs',
    [
      {
        "authorId": 1,
        "name": "Cipromox"
      },
      {
        "authorId": 2,
        "name": "Steelfab"
      },
      {
        "authorId": 3,
        "name": "Ecraze"
      },
      {
        "authorId": 4,
        "name": "Manglo"
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Blogs', null, {}),
};
