import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useBoard } from '../context/BoardContext';
import Header from '../components/Header';
import List from '../components/List';
import AddList from '../components/AddList';
import CardModal from '../components/CardModal';
import * as api from '../services/api';

// Default board ID from seed data - you'll need to update this after seeding
// const DEFAULT_BOARD_ID = 'your-board-id-here';
const  DEFAULT_BOARD_ID = process.env.REACT_APP_DEFAULT_BOARD_ID;


function Board() {
  const { board, loading, error, fetchBoard, fetchLabelsAndMembers, updateBoardState } = useBoard();
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, you'd get the board ID from URL params or similar
    fetchBoard(DEFAULT_BOARD_ID);
    fetchLabelsAndMembers();
  }, [fetchBoard, fetchLabelsAndMembers]);

  const handleDragEnd = async (result) => {
    const { source, destination, type } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'list') {
      // Reorder lists
      const newLists = Array.from(board.lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      updateBoardState(prev => ({ ...prev, lists: newLists }));

      try {
        await api.reorderLists(newLists.map(list => list.id));
      } catch (error) {
        console.error('Failed to reorder lists:', error);
        fetchBoard(DEFAULT_BOARD_ID);
      }
    } else if (type === 'card') {
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;

      if (sourceListId === destListId) {
        // Reorder within same list
        const list = board.lists.find(l => l.id === sourceListId);
        const newCards = Array.from(list.cards);
        const [removed] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, removed);

        updateBoardState(prev => ({
          ...prev,
          lists: prev.lists.map(l =>
            l.id === sourceListId ? { ...l, cards: newCards } : l
          ),
        }));

        try {
          await api.reorderCards(newCards.map(card => card.id), sourceListId);
        } catch (error) {
          console.error('Failed to reorder cards:', error);
          fetchBoard(DEFAULT_BOARD_ID);
        }
      } else {
        // Move card to different list
        const sourceList = board.lists.find(l => l.id === sourceListId);
        const destList = board.lists.find(l => l.id === destListId);
        
        const sourceCards = Array.from(sourceList.cards);
        const destCards = Array.from(destList.cards);
        
        const [removed] = sourceCards.splice(source.index, 1);
        destCards.splice(destination.index, 0, removed);

        updateBoardState(prev => ({
          ...prev,
          lists: prev.lists.map(l => {
            if (l.id === sourceListId) return { ...l, cards: sourceCards };
            if (l.id === destListId) return { ...l, cards: destCards };
            return l;
          }),
        }));

        try {
          await api.moveCard(removed.id, sourceListId, destListId, destination.index);
        } catch (error) {
          console.error('Failed to move card:', error);
          fetchBoard(DEFAULT_BOARD_ID);
        }
      }
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-600">
      <Header 
        boardTitle={board.title} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 h-full"
              >
                {board.lists.map((list, index) => (
                  <List
                    key={list.id}
                    list={list}
                    index={index}
                    onCardClick={handleCardClick}
                  />
                ))}
                {provided.placeholder}
                <AddList boardId={board.id} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={closeModal}
          onUpdate={async () => {
            await fetchBoard(DEFAULT_BOARD_ID);
            const updatedCard = board.lists
              .flatMap(l => l.cards)
              .find(c => c.id === selectedCard.id);
            if (updatedCard) setSelectedCard(updatedCard);
          }}
        />
      )}
    </div>
  );
}

export default Board;