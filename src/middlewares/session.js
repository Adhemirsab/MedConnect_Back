const { User } = require("../sequelize/sequelize");
const { handleHttpError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies) {
      handleHttpError(res, "Necesita iniciar sesion", 401);
      return;
    }
    // const token = req.headers.authorization.split(" ").pop(); //bearer token
    // const dev = cookies.session;

    const dataToken = await verifyToken(req.cookies.localSession);

    if (!dataToken.id) {
      handleHttpError(res, "ERROR_ID_TOKEN", 401);
      return;
    }

    const user = await User.findByPk(dataToken.id);
    const userJson = user.toJSON();
    delete userJson.password;
    req.user = userJson;
    next();
  } catch (error) {
    handleHttpError(res, "NOT_SESSION", 401);
  }
};

module.exports = authMiddleware;
