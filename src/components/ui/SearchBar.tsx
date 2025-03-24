
import React, { useState } from "react";
import { Search, X } from "lucide-react";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-8 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {query.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
