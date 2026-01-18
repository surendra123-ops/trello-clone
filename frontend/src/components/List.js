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
          className={`flex flex-col w-80 sm:w-72 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex-shrink-0 max-h-full border border-gray-200 ${
            snapshot.isDragging ? 'opacity-70 shadow-2xl ring-2 ring-trello-primary scale-105' : ''
          }`}
        >
          {/* List Header */}
          <div
            {...provided.dragHandleProps}
            className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 rounded-t-xl border-b-2 border-gray-200 hover:border-trello-primary transition-colors"
          >
            <h3 className="font-bold text-gray-900 text-lg hover:text-trello-primary transition-colors">{list.title}</h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl py-2 z-10 w-48 border border-gray-200">
                  <button
                    onClick={handleDeleteList}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition-colors"
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
                className={`flex-1 overflow-y-auto px-3 py-2 transition-all duration-200 ${
                  snapshot.isDraggingOver ? 'bg-cyan-100 bg-opacity-50' : 'bg-gray-50 bg-opacity-30'
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
          <div className="px-3 pb-3">
            {isAddingCard ? (
              <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
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
                  className="w-full outline-none resize-none text-sm text-gray-800 placeholder-gray-400 font-medium"
                  rows={2}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddCard}
                    className="px-4 py-2 bg-gradient-to-r from-trello-primary to-trello-primary-dark text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm"
                  >
                    Add Card
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardTitle('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="w-full text-left px-3 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm hover:text-gray-900"
              >
                <Plus className="w-5 h-5" />
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
