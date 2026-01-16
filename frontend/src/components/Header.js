import React from 'react';
import { Search, Home } from 'lucide-react';

function Header({ boardTitle, searchQuery, onSearchChange }) {
  return (
    <header className="bg-black bg-opacity-20 backdrop-blur-sm text-white px-4 py-3 flex items-center gap-4">
      <Home className="w-6 h-6" />
      <h1 className="text-xl font-bold">{boardTitle}</h1>
      
      <div className="ml-auto flex items-center gap-2 bg-white bg-opacity-20 rounded px-3 py-2 max-w-md">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent outline-none placeholder-white placeholder-opacity-70 w-64"
        />
      </div>
    </header>
  );
}

export default Header;