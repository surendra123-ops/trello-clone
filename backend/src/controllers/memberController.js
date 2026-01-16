const memberService = require('../services/memberService');

exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await memberService.getAllMembers();
    res.json(members);
  } catch (error) {
    next(error);
  }
};