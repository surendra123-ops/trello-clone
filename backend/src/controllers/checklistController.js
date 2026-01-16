const checklistService = require('../services/checklistService');

exports.addChecklistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const item = await checklistService.addChecklistItem(id, title);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

exports.updateChecklistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const item = await checklistService.updateChecklistItem(id, updateData);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.deleteChecklistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await checklistService.deleteChecklistItem(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};