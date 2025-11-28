const express = require("express");
const topicController = require("../controllers/topic");
const router = express.Router();

router.get("/", topicController.showAll);
router.post("/", topicController.create);

module.exports = router;
