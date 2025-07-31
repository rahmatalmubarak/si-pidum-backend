'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('perkara', 'undang_pasal', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('perkara', 'undang_pasal', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
