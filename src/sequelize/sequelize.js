const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
// const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
// const sequelize = new Sequelize(
//   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/medconnect`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "../models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "../models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

// console.log(sequelize.models);
const createAppointment = async (req, res) => {
  try {
    const { body } = req;

    const newAppointment = await Appointment.create({
      scheduledDate: body.scheduledDate,
      scheduledTime: body.scheduledTime,
      status: body.status,
      userId: body.userId,
      patientId: body.patientId,
    });

    if (newAppointment) {
      res.status(200).json({ message: "¡Cita creada exitosamente!" });
    } else {
      handleHttpError(res, "Error al crear la cita", 404);
    }
  } catch (error) {
    handleHttpError(res, { error: error.message }, 500);
  }
};
const {
  Specialization,
  Medico,
  MedicoCalification,
  Schedule,
  Appointment,
  PatientsReview,
  Patient,
  Payment,
  Office,
  Administrator,
  City,
  User,
} = sequelize.models;

//DEFINIENDO RELACIONES MEDICOS

Medico.belongsToMany(Specialization, { through: "medicoSpecialization" });
Specialization.belongsToMany(Medico, { through: "medicoSpecialization" });

User.hasOne(Medico);
Medico.belongsTo(User);

Medico.hasOne(MedicoCalification);
Medico.hasMany(Schedule);
Schedule.belongsTo(Medico);

// Medico.belongsTo(Office);
Medico.belongsTo(City);

// DEFINIEDO RELACIONES PATIENTS
User.hasMany(Patient, {
  foreignKey: "userId",
  onDelete: "CASCADE", // Eliminación en cascada: eliminará automáticamente los pacientes relacionados
  hooks: true, // Habilitar los hooks (ganchos) para ejecutar acciones antes y después de la eliminación
});
Patient.belongsTo(User);

Patient.hasMany(PatientsReview);

Patient.hasMany(Appointment);
Appointment.belongsTo(Patient);

Patient.hasMany(Payment);
Patient.belongsTo(City);
Appointment.hasOne(Payment);
// Appointment.belongsTo(Office);
// * DEFINIEDO RELACIONES USERS
User.hasMany(Appointment);
Appointment.belongsTo(User);

User.hasMany(PatientsReview);
PatientsReview.belongsTo(User);

//*DEFINIENDO RELACIONES ADMINISTRATOR
Administrator.belongsTo(City);
module.exports = {
  ...sequelize.models, // para \poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
