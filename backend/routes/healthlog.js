const express = require("express");
const router = express.Router();
const {
  getLogsByPetId,
  getTimelineByPetId,
} = require("../controllers/healthLogController");

const { authenticateToken } = require("../middlewares/auth");

router.get("/logs/:petId", authenticateToken, getLogsByPetId);
router.get("/timeline/:petId", authenticateToken, getTimelineByPetId);

module.exports = router;
