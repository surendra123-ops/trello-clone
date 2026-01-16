import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import * as api from '../services/api';
import { useBoard } from '../context/BoardContext';

function AddList({ boardId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const { fetchBoard } = useBoard();

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      await api.createList(title, boardId);
      setTitle('');
      setIsAdding(false);
      fetchBoard(boardId);
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  if (!isAdding) {
    return (
      <div className="w-72 flex-shrink-0">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg px-4 py-3 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add another list
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-100 rounded-lg p-2 flex-shrink-0">
      <input
        type="text"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
          if (e.key === 'Escape') setIsAdding(false);
        }}
        placeholder="Enter list title..."
        className="w-full px-3 py-2 mb-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add List
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setTitle('');
          }}
          className="p-2 hover:bg-gray-200 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default AddList;