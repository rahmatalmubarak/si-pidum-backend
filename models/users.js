'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_hp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remember_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: true, // Karena kita definisikan created_at & updated_at manual
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });

  return User;
};
