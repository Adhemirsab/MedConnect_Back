const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegisterUser = [
  check("first_name")
    .exists()
    .withMessage("El nombre es requerido")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3, max: 99 })
    .withMessage("El nombre debe tener entre 3 y 99 caracteres"),
  check("last_name")
    .exists()
    .withMessage("El apellido es requerido")
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ min: 3, max: 99 })
    .withMessage("El apellido debe tener entre 3 y 99 caracteres"),
  check("email")
    .exists()
    .withMessage("El correo electrónico es requerido")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  check("password")
    .exists()
    .withMessage("La contraseña es requerida")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 6, max: 30 })
    .withMessage("La contraseña debe tener entre 6 y 30 caracteres"),
  check("role")
    .exists()
    .withMessage("El rol es requerido")
    .notEmpty()
    .withMessage("El rol no puede estar vacío")
    .isIn(["paciente", "medico", "admin"])
    .withMessage("El rol debe ser uno de 'paciente', 'medico' o 'admin'"),
  (req, res, next) => validateResults(req, res, next),
];
const validatorLoginUser = [
  check("email")
    .exists()
    .withMessage("El correo electrónico es obligatorio")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico debe tener un formato válido"),
  check("password")
    .exists()
    .withMessage("La contraseña es obligatoria")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 3, max: 15 })
    .withMessage("La contraseña debe tener entre 3 y 15 caracteres"),
  (req, res, next) => validateResults(req, res, next),
];
module.exports = { validatorRegisterUser, validatorLoginUser };
