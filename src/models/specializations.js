const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "specialization",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      url: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      deletedAt: {
        // Columna para el borrado lógico
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true, // Habilitar borrado lógico
    },
    {
      timestamps: true,
    }
  );
};
