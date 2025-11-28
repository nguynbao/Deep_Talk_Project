const express = require("express");
const gameController = require("../controllers/game");
const router = express.Router();

router.post("/start", gameController.start);
router.post("/:id/next", gameController.nextTurn);

module.exports = router;
