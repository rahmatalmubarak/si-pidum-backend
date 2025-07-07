'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('perkara', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('UUID'),
        allowNull: false,
        primaryKey: true,
      },
      nama_tersangka: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tahapan_berkas: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tanggal_berkas: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      tahapan_sidang: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tanggal_sidang: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      jaksa_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      jaksa_kedua_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tu_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      habis_penahanan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('perkara');
  },
};
