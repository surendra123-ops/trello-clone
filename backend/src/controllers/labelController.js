const labelService = require('../services/labelService');

exports.getAllLabels = async (req, res, next) => {
  try {
    const labels = await labelService.getAllLabels();
    res.json(labels);
  } catch (error) {
    next(error);
  }
};