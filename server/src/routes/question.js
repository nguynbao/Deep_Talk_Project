const questionController = require("../controllers/question");
const express = require("express");
const router = express.Router();

router.get("/", questionController.showAll);
router.get("/filter", questionController.filter);
router.get("/:id", questionController.showOne);
router.post("/", questionController.create);
router.put("/:id", questionController.update);
router.delete("/:id", questionController.destroy);


module.exports = router;
