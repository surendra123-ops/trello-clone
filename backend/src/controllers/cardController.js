const cardService = require('../services/cardService');

exports.createCard = async (req, res, next) => {
  try {
    const { title, listId, description } = req.body;
    
    if (!title || !listId) {
      return res.status(400).json({ error: 'Title and listId are required' });
    }

    const card = await cardService.createCard({ title, listId, description });
    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

exports.updateCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const card = await cardService.updateCard(id, updateData);
    res.json(card);
  } catch (error) {
    next(error);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    await cardService.deleteCard(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.reorderCards = async (req, res, next) => {
  try {
    const { cardIds, listId } = req.body;
    
    if (!Array.isArray(cardIds) || !listId) {
      return res.status(400).json({ error: 'cardIds (array) and listId are required' });
    }

    await cardService.reorderCards(cardIds, listId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.moveCard = async (req, res, next) => {
  try {
    const { cardId, sourceListId, destListId, newPosition } = req.body;
    
    if (!cardId || !sourceListId || !destListId || newPosition === undefined) {
      return res.status(400).json({ 
        error: 'cardId, sourceListId, destListId, and newPosition are required' 
      });
    }

    await cardService.moveCard(cardId, sourceListId, destListId, newPosition);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.searchCards = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const cards = await cardService.searchCards(q);
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

exports.filterCards = async (req, res, next) => {
  try {
    const { labels, members, due } = req.query;
    
    const filters = {
      labels: labels ? labels.split(',') : undefined,
      members: members ? members.split(',') : undefined,
      due: due || undefined,
    };

    const cards = await cardService.filterCards(filters);
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

exports.addLabel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { labelId } = req.body;
    
    if (!labelId) {
      return res.status(400).json({ error: 'labelId is required' });
    }

    const cardLabel = await cardService.addLabel(id, labelId);
    res.status(201).json(cardLabel);
  } catch (error) {
    next(error);
  }
};

exports.removeLabel = async (req, res, next) => {
  try {
    const { id, labelId } = req.params;
    await cardService.removeLabel(id, labelId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    
    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required' });
    }

    const cardMember = await cardService.addMember(id, memberId);
    res.status(201).json(cardMember);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    await cardService.removeMember(id, memberId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.addChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Checklist title is required' });
    }

    const checklist = await cardService.addChecklist(id, title);
    res.status(201).json(checklist);
  } catch (error) {
    next(error);
  }
};