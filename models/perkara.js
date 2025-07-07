'use strict';

module.exports = (sequelize, DataTypes) => {
  const Perkara = sequelize.define(
    'Perkara',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      nama_tersangka: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tahapan_berkas: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanggal_berkas: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      tahapan_sidang: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanggal_sidang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      jaksa_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      jaksa_kedua_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      tu_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      habis_penahanan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: 'perkara',
      timestamps: true,   // kolom created_at & updated_at ditangani manual
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  /** Relasi: Perkara ➜ User */
  Perkara.associate = (models) => {
    Perkara.belongsTo(models.User, {
      as: 'jaksa',
      foreignKey: 'jaksa_id',
    });
    Perkara.belongsTo(models.User, {
      as: 'jaksaKedua',
      foreignKey: 'jaksa_kedua_id',
    });
    Perkara.belongsTo(models.User, {
      as: 'tu',
      foreignKey: 'tu_id',
    });
  };

  return Perkara;
};
