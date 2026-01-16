const express = require('express');
const listController = require('../controllers/listController');

const router = express.Router();

router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.delete('/:id', listController.deleteList);
router.patch('/reorder', listController.reorderLists);

module.exports = router;