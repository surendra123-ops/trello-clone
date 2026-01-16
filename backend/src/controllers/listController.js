const listService = require('../services/listService');

exports.createList = async (req, res, next) => {
  try {
    const { title, boardId } = req.body;
    
    if (!title || !boardId) {
      return res.status(400).json({ error: 'Title and boardId are required' });
    }

    const list = await listService.createList(title, boardId);
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
};

exports.updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const list = await listService.updateList(id, title);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await listService.deleteList(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.reorderLists = async (req, res, next) => {
  try {
    const { listIds } = req.body;
    
    if (!Array.isArray(listIds)) {
      return res.status(400).json({ error: 'listIds must be an array' });
    }

    await listService.reorderLists(listIds);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};