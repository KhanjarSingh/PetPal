const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const { createTask, getDailyTasks, getUpcomingTasks, completeTask } = require("../controllers/taskController");

router.post("/", authenticateToken, createTask);
router.get("/daily", authenticateToken, getDailyTasks);
router.get("/upcoming", authenticateToken, getUpcomingTasks);
router.put("/:id/complete", authenticateToken, completeTask);

module.exports = router;
