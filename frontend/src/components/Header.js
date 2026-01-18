import React from 'react';
import { Search, Home } from 'lucide-react';

function Header({ boardTitle, searchQuery, onSearchChange }) {
  return (
    <header className="bg-trello-dark border-b border-trello-dark-light text-white px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3">
        <Home className="w-5 h-5 sm:w-6 sm:h-6 text-trello-primary" />
        <h1 className="text-lg sm:text-2xl font-bold truncate">{boardTitle}</h1>
      </div>
      
      <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 sm:gap-3 bg-trello-dark-light rounded-lg px-3 sm:px-4 py-2 sm:max-w-md border border-trello-dark-light hover:border-trello-primary transition-colors">
        <Search className="w-4 h-4 text-trello-primary flex-shrink-0" />
        <input
          type="text"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent outline-none placeholder-gray-400 w-full sm:w-64 text-white text-sm sm:text-base"
        />
      </div>
    </header>
  );
}

export default Header;
