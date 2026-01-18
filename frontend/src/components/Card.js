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
          className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 mb-3 shadow-md hover:shadow-xl cursor-pointer transition-all duration-200 border border-gray-200 hover:border-trello-primary group ${
            snapshot.isDragging ? 'opacity-60 shadow-2xl scale-105 ring-2 ring-trello-primary' : ''
          }`}
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-trello-primary to-trello-primary-dark rounded-t-xl group-hover:h-2 transition-all"></div>

          {/* Labels */}
          {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {card.labels.map(({ label }) => (
                <span
                  key={label.id}
                  className="px-3 py-1.5 rounded-full text-xs text-white font-semibold shadow-sm"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="text-sm font-bold text-gray-900 mb-3 leading-snug group-hover:text-trello-primary transition-colors">{card.title}</div>

          {/* Meta Information */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Due Date */}
            {card.dueDate && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold border transition-all ${
                  isOverdue
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : isDueToday
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {new Date(card.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Checklist Progress */}
            {totalChecklistItems > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{completedChecklistItems}/{totalChecklistItems}</span>
              </div>
            )}

            {/* Members */}
            {card.members.length > 0 && (
              <div className="flex items-center gap-1.5 ml-auto">
                <div className="flex -space-x-1.5">
                  {card.members.slice(0, 3).map(({ member }) => (
                    <img
                      key={member.id}
                      src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=06b6d4&color=fff`}
                      alt={member.name}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:z-10 transition-all hover:scale-110"
                      title={member.name}
                    />
                  ))}
                  {card.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
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
