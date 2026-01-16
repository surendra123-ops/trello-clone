import React, { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const BoardContext = createContext();

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within BoardProvider');
  }
  return context;
};

export const BoardProvider = ({ children }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allLabels, setAllLabels] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

  const fetchBoard = useCallback(async (boardId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBoard(boardId);
      setBoard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLabelsAndMembers = useCallback(async () => {
    try {
      const [labels, members] = await Promise.all([
        api.getAllLabels(),
        api.getAllMembers(),
      ]);
      setAllLabels(labels);
      setAllMembers(members);
    } catch (err) {
      console.error('Failed to fetch labels/members:', err);
    }
  }, []);

  const updateBoardState = useCallback((updater) => {
    setBoard(prevBoard => updater(prevBoard));
  }, []);

  const value = {
    board,
    loading,
    error,
    allLabels,
    allMembers,
    fetchBoard,
    fetchLabelsAndMembers,
    updateBoardState,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};