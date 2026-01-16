const express = require('express');
const labelController = require('../controllers/labelController');

const router = express.Router();

router.get('/', labelController.getAllLabels);

module.exports = router;