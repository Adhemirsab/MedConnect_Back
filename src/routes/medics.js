const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");
const {
  createMedic,
  getMedics,
  getMedic,
  updateMedic,
} = require("../controllers/medicsController");

router.get("/", getMedics);
router.get("/:id", getMedic);
router.post("/create", createMedic);
router.put("/:id", updateMedic);

module.exports = router;
// authMiddleware, checkRole(["admin"])
