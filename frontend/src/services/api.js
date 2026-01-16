import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Boards
export const getBoard = async (id) => {
  const { data } = await axiosInstance.get(`/boards/${id}`);
  return data;
};

export const createBoard = async (title) => {
  const { data } = await axiosInstance.post('/boards', { title });
  return data;
};

// Lists
export const createList = async (title, boardId) => {
  const { data } = await axiosInstance.post('/lists', { title, boardId });
  return data;
};

export const updateList = async (id, title) => {
  const { data } = await axiosInstance.put(`/lists/${id}`, { title });
  return data;
};

export const deleteList = async (id) => {
  await axiosInstance.delete(`/lists/${id}`);
};

export const reorderLists = async (listIds) => {
  const { data } = await axiosInstance.patch('/lists/reorder', { listIds });
  return data;
};

// Cards
export const createCard = async (cardData) => {
  const { data } = await axiosInstance.post('/cards', cardData);
  return data;
};

export const updateCard = async (id, updateData) => {
  const { data } = await axiosInstance.put(`/cards/${id}`, updateData);
  return data;
};

export const deleteCard = async (id) => {
  await axiosInstance.delete(`/cards/${id}`);
};

export const reorderCards = async (cardIds, listId) => {
  const { data } = await axiosInstance.patch('/cards/reorder', { cardIds, listId });
  return data;
};

export const moveCard = async (cardId, sourceListId, destListId, newPosition) => {
  const { data } = await axiosInstance.patch('/cards/move', {
    cardId,
    sourceListId,
    destListId,
    newPosition,
  });
  return data;
};

export const searchCards = async (query) => {
  const { data } = await axiosInstance.get(`/cards/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const filterCards = async (filters) => {
  const params = new URLSearchParams();
  if (filters.labels) params.append('labels', filters.labels.join(','));
  if (filters.members) params.append('members', filters.members.join(','));
  if (filters.due) params.append('due', filters.due);
  
  const { data } = await axiosInstance.get(`/cards/filter?${params.toString()}`);
  return data;
};

// Card Labels
export const addLabelToCard = async (cardId, labelId) => {
  const { data } = await axiosInstance.post(`/cards/${cardId}/labels`, { labelId });
  return data;
};

export const removeLabelFromCard = async (cardId, labelId) => {
  await axiosInstance.delete(`/cards/${cardId}/labels/${labelId}`);
};

// Card Members
export const addMemberToCard = async (cardId, memberId) => {
  const { data } = await axiosInstance.post(`/cards/${cardId}/members`, { memberId });
  return data;
};

export const removeMemberFromCard = async (cardId, memberId) => {
  await axiosInstance.delete(`/cards/${cardId}/members/${memberId}`);
};

// Checklists
export const addChecklistToCard = async (cardId, title) => {
  const { data } = await axiosInstance.post(`/cards/${cardId}/checklists`, { title });
  return data;
};

export const addChecklistItem = async (checklistId, title) => {
  const { data } = await axiosInstance.post(`/checklists/${checklistId}/items`, { title });
  return data;
};

export const updateChecklistItem = async (itemId, updateData) => {
  const { data } = await axiosInstance.patch(`/checklists/items/${itemId}`, updateData);
  return data;
};

export const deleteChecklistItem = async (itemId) => {
  await axiosInstance.delete(`/checklists/items/${itemId}`);
};

// Labels
export const getAllLabels = async () => {
  const { data } = await axiosInstance.get('/labels');
  return data;
};

// Members
export const getAllMembers = async () => {
  const { data } = await axiosInstance.get('/members');
  return data;
};