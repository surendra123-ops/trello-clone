import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Calendar, CheckSquare, User } from 'lucide-react';

function Card({ card, index, onClick }) {
  const totalChecklistItems = card.checklists.reduce(
    (sum, checklist) => sum + checklist.items.length,
    0
  );
  const completedChecklistItems = card.checklists.reduce(
    (sum, checklist) => sum + checklist.items.filter(item => item.completed).length,
    0
  );

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueToday = card.dueDate && 
    new Date(card.dueDate).toDateString() === new Date().toDateString();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded p-3 mb-2 shadow hover:shadow-md cursor-pointer ${
            snapshot.isDragging ? 'opacity-50' : ''
          }`}
        >
          {/* Labels */}
          {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map(({ label }) => (
                <span
                  key={label.id}
                  className="px-2 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="text-sm text-gray-800 mb-2">{card.title}</div>

          {/* Meta Information */}
          <div className="flex items-center gap-3 text-xs text-gray-600">
            {/* Due Date */}
            {card.dueDate && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded ${
                  isOverdue
                    ? 'bg-red-100 text-red-700'
                    : isDueToday
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {new Date(card.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Checklist Progress */}
            {totalChecklistItems > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                {completedChecklistItems}/{totalChecklistItems}
              </div>
            )}

            {/* Members */}
            {card.members.length > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                <User className="w-3 h-3" />
                <div className="flex -space-x-2">
                  {card.members.slice(0, 3).map(({ member }) => (
                    <img
                      key={member.id}
                      src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                      alt={member.name}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      title={member.name}
                    />
                  ))}
                  {card.members.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs">
                      +{card.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Card;