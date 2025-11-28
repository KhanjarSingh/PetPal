const express = require("express");
const router = express.Router();
const {
  createTask,
  getDailyTasks,
  getUpcomingTasks,
  completeTask,
} = require("../controllers/taskController");
const { validateTask } = require("../middlewares/validation");

router.post("/", validateTask, createTask);
router.get("/daily", getDailyTasks);
router.get("/upcoming", getUpcomingTasks);
router.put("/:id/complete", completeTask);

module.exports = router;
