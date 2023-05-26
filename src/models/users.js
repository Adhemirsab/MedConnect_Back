const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Agregamos la opción unique para evitar que se repita el email
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("paciente", "medico", "admin"),
        defaultValue: "paciente",
      },
      deletedAt: {
        // Columna para el borrado lógico
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true, // Habilitar borrado lógico
    }
  );

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password; // Excluir el campo de contraseña
    return values;
  };

  return User;
};
