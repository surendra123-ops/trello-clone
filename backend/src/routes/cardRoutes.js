const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

router.get('/search', cardController.searchCards);
router.get('/filter', cardController.filterCards);
router.post('/', cardController.createCard);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);
router.patch('/reorder', cardController.reorderCards);
router.patch('/move', cardController.moveCard);

// Card details - labels
router.post('/:id/labels', cardController.addLabel);
router.delete('/:id/labels/:labelId', cardController.removeLabel);

// Card details - members
router.post('/:id/members', cardController.addMember);
router.delete('/:id/members/:memberId', cardController.removeMember);

// Card details - checklists
router.post('/:id/checklists', cardController.addChecklist);

module.exports = router;