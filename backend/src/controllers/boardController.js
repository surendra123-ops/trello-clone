const boardService = require('../services/boardService');

exports.getBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const board = await boardService.getBoard(id);
    res.json(board);
  } catch (error) {
    next(error);
  }
};

exports.createBoard = async (req, res, next) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const board = await boardService.createBoard(title);
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};