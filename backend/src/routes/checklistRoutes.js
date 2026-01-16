const express = require('express');
const checklistController = require('../controllers/checklistController');

const router = express.Router();

router.post('/:id/items', checklistController.addChecklistItem);
router.patch('/items/:id', checklistController.updateChecklistItem);
router.delete('/items/:id', checklistController.deleteChecklistItem);

module.exports = router;