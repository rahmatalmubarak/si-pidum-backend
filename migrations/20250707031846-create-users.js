/* eslint-disable */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('UUID'), // MySQL/MariaDB; gunakan Sequelize.UUIDV4 untuk default di Postgres
        allowNull: false,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,           // tambahkan unik jika perlu
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jabatan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      no_hp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      foto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remember_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface /* , Sequelize */) => {
    await queryInterface.dropTable('users');
  },
};
