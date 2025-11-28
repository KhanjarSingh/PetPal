const express = require("express");
const router = express.Router();
const {
  getLogsByPetId,
  getTimelineByPetId,
} = require("../controllers/healthLogController");

router.get("/logs/:petId", getLogsByPetId);
router.get("/timeline/:petId", getTimelineByPetId);

module.exports = router;
