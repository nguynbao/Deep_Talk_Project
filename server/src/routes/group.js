const groupController = require("../controllers/group");
const express = require("express");
const router = express.Router();

router.get("/", groupController.showAll);
router.get("/:id", groupController.showOne);
router.post("/", groupController.create);
router.put("/:id", groupController.update);
router.delete("/:id", groupController.destroy);
router.post("/:id/users", groupController.addUser);
router.post("/:id/users/remove", groupController.removeUser);

module.exports = router;
