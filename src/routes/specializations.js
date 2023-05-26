const express = require("express");
const router = express.Router();
//const uploadMiddleware = require("../utils/handleStorage");
const {
  createSpecializations,
  getSpecializations,
  deleteSpecializations,
  getSpecialization,
  updateSpecialization,
  restoreSpec,
} = require("../controllers/specializationController");

router.get("/", getSpecializations);
router.get("/:id", getSpecialization);
router.post("/", createSpecializations);
router.put("/:id", updateSpecialization);
router.delete("/:id", deleteSpecializations);
router.patch("/:id", restoreSpec);
module.exports = router;
