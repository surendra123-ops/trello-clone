import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Card from './Card';
import * as api from '../services/api';
import { useBoard } from '../context/BoardContext';

function List({ list, index, onCardClick }) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { fetchBoard } = useBoard();

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    try {
      await api.createCard({
        title: newCardTitle,
        listId: list.id,
      });
      setNewCardTitle('');
      setIsAddingCard(false);
      fetchBoard(list.boardId);
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleDeleteList = async () => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await api.deleteList(list.id);
        fetchBoard(list.boardId);
      } catch (error) {
        console.error('Failed to delete list:', error);
      }
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex flex-col w-72 bg-gray-100 rounded-lg shadow-md flex-shrink-0 max-h-full ${
            snapshot.isDragging ? 'opacity-50' : ''
          }`}
        >
          {/* List Header */}
          <div
            {...provided.dragHandleProps}
            className="px-3 py-2 flex items-center justify-between"
          >
            <h3 className="font-semibold text-gray-800">{list.title}</h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white rounded shadow-lg py-1 z-10 w-48">
                  <button
                    onClick={handleDeleteList}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete List
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <Droppable droppableId={list.id} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto px-2 pb-2 ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : ''
                }`}
              >
                {list.cards.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    onClick={() => onCardClick(card)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Card */}
          <div className="px-2 pb-2">
            {isAddingCard ? (
              <div className="bg-white rounded p-2 shadow">
                <textarea
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddCard();
                    }
                  }}
                  placeholder="Enter card title..."
                  className="w-full outline-none resize-none"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddCard}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardTitle('');
                    }}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="w-full text-left px-2 py-2 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add a card
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default List;