'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('perkara', 'no_berkas', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'nama_tersangka',
    });

    await queryInterface.addColumn('perkara', 'no_surat', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'no_berkas',
    });

    await queryInterface.addColumn('perkara', 'tgl_surat', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      after: 'no_surat',
    });

    await queryInterface.addColumn('perkara', 'ur_ipp', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'tgl_surat',
    });

    await queryInterface.addColumn('perkara', 'undang_pasal', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'ur_ipp',
    });

    await queryInterface.addColumn('perkara', 'tempat_kejadian', {
      type: Sequelize.TEXT,
      allowNull: false,
      after: 'undang_pasal',
    });

    await queryInterface.addColumn('perkara', 'terima_spdp', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      after: 'tempat_kejadian',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('perkara', 'terima_spdp');
    await queryInterface.removeColumn('perkara', 'tempat_kejadian');
    await queryInterface.removeColumn('perkara', 'undang_pasal');
    await queryInterface.removeColumn('perkara', 'ur_ipp');
    await queryInterface.removeColumn('perkara', 'tgl_surat');
    await queryInterface.removeColumn('perkara', 'no_surat');
    await queryInterface.removeColumn('perkara', 'no_berkas');
  },
};
