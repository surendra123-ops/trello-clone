import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, User, CheckSquare, Trash2, Plus } from 'lucide-react';
import * as api from '../services/api';
import { useBoard } from '../context/BoardContext';

function CardModal({ card, onClose, onUpdate }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);

  const { allLabels, allMembers } = useBoard();

  const handleUpdateCard = async (updates) => {
    try {
      await api.updateCard(card.id, updates);
      await onUpdate();
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  const handleDeleteCard = async () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await api.deleteCard(card.id);
        onClose();
        await onUpdate();
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  };

  const handleAddLabel = async (labelId) => {
    try {
      await api.addLabelToCard(card.id, labelId);
      await onUpdate();
    } catch (error) {
      console.error('Failed to add label:', error);
    }
  };

  const handleRemoveLabel = async (labelId) => {
    try {
      await api.removeLabelFromCard(card.id, labelId);
      await onUpdate();
    } catch (error) {
      console.error('Failed to remove label:', error);
    }
  };

  const handleAddMember = async (memberId) => {
    try {
      await api.addMemberToCard(card.id, memberId);
      await onUpdate();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.removeMemberFromCard(card.id, memberId);
      await onUpdate();
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    try {
      await api.addChecklistToCard(card.id, newChecklistTitle);
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
      await onUpdate();
    } catch (error) {
      console.error('Failed to add checklist:', error);
    }
  };

  const handleAddChecklistItem = async (checklistId, title) => {
    try {
      await api.addChecklistItem(checklistId, title);
      await onUpdate();
    } catch (error) {
      console.error('Failed to add checklist item:', error);
    }
  };

  const handleToggleChecklistItem = async (itemId, completed) => {
    try {
      await api.updateChecklistItem(itemId, { completed: !completed });
      await onUpdate();
    } catch (error) {
      console.error('Failed to toggle checklist item:', error);
    }
  };

  const handleDeleteChecklistItem = async (itemId) => {
    try {
      await api.deleteChecklistItem(itemId);
      await onUpdate();
    } catch (error) {
      console.error('Failed to delete checklist item:', error);
    }
  };

  const cardLabels = card.labels.map(cl => cl.label);
  const cardMembers = card.members.map(cm => cm.member);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-2 sm:py-8">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-2 sm:mx-4 shadow-xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    handleUpdateCard({ title });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                      handleUpdateCard({ title });
                    }
                  }}
                  className="text-2xl font-bold w-full border-b-2 border-trello-primary outline-none"
                  autoFocus
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                >
                  {title}
                </h2>
              )}
              <p className="text-sm text-gray-600 mt-1">
                in list <span className="font-semibold">{card.list?.title}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Labels */}
            {cardLabels.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Labels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cardLabels.map(label => (
                    <span
                      key={label.id}
                      className="px-3 py-1 rounded text-white text-sm flex items-center gap-2"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                      <button
                        onClick={() => handleRemoveLabel(label.id)}
                        className="hover:bg-white hover:bg-opacity-20 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Members */}
            {cardMembers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Members
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cardMembers.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-full pr-2"
                    >
                      <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm">{member.name}</span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="hover:bg-gray-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Due Date */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </h3>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  handleUpdateCard({ dueDate: e.target.value || null });
                }}
                className="px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              {isEditingDescription ? (
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-trello-primary resize-none"
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setIsEditingDescription(false);
                        handleUpdateCard({ description });
                      }}
                      className="px-4 py-2 bg-trello-primary text-white rounded hover:bg-trello-primary-dark transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDescription(false);
                        setDescription(card.description || '');
                      }}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className="px-3 py-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 min-h-[80px]"
                >
                  {description || 'Add a more detailed description...'}
                </div>
              )}
            </div>

            {/* Checklists */}
            {card.checklists.map(checklist => (
              <ChecklistSection
                key={checklist.id}
                checklist={checklist}
                onAddItem={handleAddChecklistItem}
                onToggleItem={handleToggleChecklistItem}
                onDeleteItem={handleDeleteChecklistItem}
              />
            ))}

            {/* Add Checklist */}
            {isAddingChecklist ? (
              <div>
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddChecklist();
                    if (e.key === 'Escape') setIsAddingChecklist(false);
                  }}
                  placeholder="Checklist title..."
                  className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-trello-primary"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddChecklist}
                    className="px-4 py-2 bg-trello-primary text-white rounded hover:bg-trello-primary-dark transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingChecklist(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-3">Add to card</h3>
            
            {/* Labels Button */}
            <div className="relative">
              <button
                onClick={() => setShowLabelMenu(!showLabelMenu)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2 text-sm"
              >
                <Tag className="w-4 h-4" />
                Labels
              </button>
              {showLabelMenu && (
                <div className="absolute left-0 mt-1 bg-white rounded shadow-lg p-2 z-10 w-64">
                  {allLabels.map(label => {
                    const isSelected = cardLabels.some(cl => cl.id === label.id);
                    return (
                      <button
                        key={label.id}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveLabel(label.id);
                          } else {
                            handleAddLabel(label.id);
                          }
                        }}
                        className="w-full px-3 py-2 mb-1 rounded text-white text-left flex items-center justify-between"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Members Button */}
            <div className="relative">
              <button
                onClick={() => setShowMemberMenu(!showMemberMenu)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2 text-sm"
              >
                <User className="w-4 h-4" />
                Members
              </button>
              {showMemberMenu && (
                <div className="absolute left-0 mt-1 bg-white rounded shadow-lg p-2 z-10 w-64">
                  {allMembers.map(member => {
                    const isSelected = cardMembers.some(cm => cm.id === member.id);
                    return (
                      <button
                        key={member.id}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveMember(member.id);
                          } else {
                            handleAddMember(member.id);
                          }
                        }}
                        className="w-full px-3 py-2 mb-1 rounded hover:bg-gray-100 text-left flex items-center gap-2"
                      >
                        <img
                          src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                          alt={member.name}
                          className="w-6 h-6 rounded-full"
                        />
                        {member.name}
                        {isSelected && <span className="ml-auto">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Checklist Button */}
            <button
              onClick={() => setIsAddingChecklist(true)}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2 text-sm"
            >
              <CheckSquare className="w-4 h-4" />
              Checklist
            </button>

            <div className="pt-4 border-t">
              <button
                onClick={handleDeleteCard}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistSection({ checklist, onAddItem, onToggleItem, onDeleteItem }) {
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedItems = checklist.items.filter(item => item.completed).length;
  const totalItems = checklist.items.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleAdd = () => {
    if (!newItemTitle.trim()) return;
    onAddItem(checklist.id, newItemTitle);
    setNewItemTitle('');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          {checklist.title}
        </h3>
        <span className="text-xs text-gray-600">
          {completedItems}/{totalItems}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
        <div
          className="h-full bg-trello-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-2 mb-2">
        {checklist.items.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onToggleItem(item.id, item.completed)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
              {item.title}
            </span>
            <button
              onClick={() => onDeleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item */}
      {isAdding ? (
        <div>
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            placeholder="Add an item..."
            className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-trello-primary text-sm"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-trello-primary text-white rounded hover:bg-trello-primary-dark transition-colors text-sm"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewItemTitle('');
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add an item
        </button>
      )}
    </div>
  );
}

export default CardModal;
