const { User } = require("../sequelize/sequelize");
const { handleHttpError } = require("../utils/handleError");
const {
  Patient,
  Appointment,
  PatientsReview,
  Medico,
  City,
} = require("../sequelize/sequelize");
const { Op } = require("sequelize");

const userGetParanoid = async (req, res) => {
  try {
    const data = await User.findAll(
      { paranoid: false },
      {
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "role",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Patient,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phone",
              "direccion",
              "dni",
              "observaciones",
            ],
            include: [
              {
                model: Appointment,
                attributes: ["scheduledDate", "scheduledTime", "status"],
              },
            ],
          },
          {
            model: Appointment,
            attributes: ["scheduledDate", "scheduledTime", "status"],
            include: [
              {
                model: Patient,
              },
            ],
          },
        ],
        attributes: {
          exclude: ["appointmentId", "cityId", "userId", "patientsReviewId"],
        },
      }
    );

    if (!data || data.length === 0) {
      return handleHttpError(res, "USUARIOS_NO_ENCONTRADOS");
    }
    const newData = data.map((user) => {
      if (user.role === "medico" || user.role === "admin") {
        const { patients, ...userWithoutPatients } = user.get({ plain: true });
        return userWithoutPatients;
      } else {
        return user;
      }
    });

    const newDataFiltered = newData.map((user) => {
      if (user.role === "admin") {
        const { appointments, ...userWithoutPatients } = user;
        return userWithoutPatients;
      } else {
        return user;
      }
    });
    const dataFinal = newDataFiltered.map((user) => {
      if (user.role === "paciente") {
        const { appointments, ...userWithoutPatients } = user.get({
          plain: true,
        });
        return userWithoutPatients;
      } else {
        return user;
      }
    });

    res.status(200).json(dataFinal);
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_OBTENER_USUARIOS");
  }
};

const userGet = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Patient,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "direccion",
            "dni",
            "observaciones",
          ],
          include: [
            {
              model: Appointment,
              attributes: ["scheduledDate", "scheduledTime", "status"],
            },
          ],
        },
        {
          model: Appointment,
          attributes: ["scheduledDate", "scheduledTime", "status"],
          include: [
            {
              model: Patient,
            },
          ],
        },
      ],
      attributes: {
        exclude: ["appointmentId", "cityId", "userId", "patientsReviewId"],
      },
    });

    if (!data || data.length === 0) {
      return handleHttpError(res, "USUARIOS_NO_ENCONTRADOS");
    }
    const newData = data.map((user) => {
      if (user.role === "medico" || user.role === "admin") {
        const { patients, ...userWithoutPatients } = user.get({ plain: true });
        return userWithoutPatients;
      } else {
        return user;
      }
    });

    const newDataFiltered = newData.map((user) => {
      if (user.role === "admin") {
        const { appointments, ...userWithoutPatients } = user;
        return userWithoutPatients;
      } else {
        return user;
      }
    });
    const dataFinal = newDataFiltered.map((user) => {
      if (user.role === "paciente") {
        const { appointments, ...userWithoutPatients } = user.get({
          plain: true,
        });
        return userWithoutPatients;
      } else {
        return user;
      }
    });

    res.status(200).json(dataFinal);
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_OBTENER_USUARIOS");
  }
};

const getUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Medico,
          include: [
            {
              model: City,
              attributes: ["name"],
            },
          ],
          attributes: {
            exclude: ["cityId"],
          },
        },
      ],
      attributes: {
        exclude: ["userId"],
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `No existe un usuario con id ${id}` });
    }

    let userData = null;

    if (user.role === "paciente") {
      userData = await User.findByPk(id, {
        include: [
          {
            model: Patient,
            attributes: ["firstName", "lastName", "phone"],
          },
        ],
      });
    } else {
      userData = user;
    }

    res.status(200).json(userData);
  } catch (error) {
    handleHttpError(res, "No existe un usuario con ese id", 404);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByPk(id);

    if (!deleted) {
      return handleHttpError(res, `Usuario con id ${id} no encontrado`);
    }
    await deleted.destroy();

    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    handleHttpError(res, { error: error.message }, 404);
  }
};

const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByPk(id, { paranoid: false });

    if (!deleted) {
      return handleHttpError(res, `Usuario con id ${id} no encontrado`);
    }

    // Verificar si el usuario está marcado como eliminado
    if (deleted.deletedAt === null) {
      return handleHttpError(
        res,
        `El usuario con id ${id} no ha sido eliminado`
      );
    }

    // Restaurar el usuario
    await deleted.restore();

    res.status(200).json({ message: "Usuario restaurado" });
  } catch (error) {
    handleHttpError(res, { error: error.message }, 404);
  }
};

module.exports = {
  userGet,
  getUserId,
  deleteUser,
  restoreUser,
  userGetParanoid,
};
