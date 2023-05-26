const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "medico",

    {
      // medicoId: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true,
      //   unique: true, // Asegura que la columna sea única
      // },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
