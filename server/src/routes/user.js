const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.get('/', userController.showAll);
router.get('/:id', userController.showOne);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.destroy);

module.exports = router;
