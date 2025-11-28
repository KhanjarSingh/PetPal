const express = require("express");
const router = express.Router();
const {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
} = require("../controllers/petController");
const { validatePet } = require("../middlewares/validation");

router.post("/", validatePet, createPet);
router.get("/", getAllPets);
router.get("/:id", getPetById);
router.put("/:id", updatePet);

module.exports = router;
