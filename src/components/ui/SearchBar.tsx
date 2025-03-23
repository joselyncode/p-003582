
import React from "react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Quick search",
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`bg-gray-100 rounded flex items-center px-3 py-1.5 w-full ${className}`}
    >
      <div className="flex-shrink-0">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[14px] h-[14px] text-gray-500"
        >
          <g clipPath="url(#clip0_10_877)">
            <path
              d="M11.375 5.6875C11.375 6.94258 10.9676 8.10195 10.2812 9.04258L13.743 12.507C14.0848 12.8488 14.0848 13.4039 13.743 13.7457C13.4012 14.0875 12.8461 14.0875 12.5043 13.7457L9.04258 10.2812C8.10195 10.9703 6.94258 11.375 5.6875 11.375C2.5457 11.375 0 8.8293 0 5.6875C0 2.5457 2.5457 0 5.6875 0C8.8293 0 11.375 2.5457 11.375 5.6875ZM5.6875 9.625C6.20458 9.625 6.7166 9.52315 7.19432 9.32528C7.67204 9.1274 8.1061 8.83736 8.47173 8.47173C8.83736 8.1061 9.1274 7.67204 9.32528 7.19432C9.52315 6.7166 9.625 6.20458 9.625 5.6875C9.625 5.17042 9.52315 4.6584 9.32528 4.18068C9.1274 3.70296 8.83736 3.2689 8.47173 2.90327C8.1061 2.53764 7.67204 2.2476 7.19432 2.04972C6.7166 1.85185 6.20458 1.75 5.6875 1.75C5.17042 1.75 4.6584 1.85185 4.18068 2.04972C3.70296 2.2476 3.2689 2.53764 2.90327 2.90327C2.53764 3.2689 2.2476 3.70296 2.04972 4.18068C1.85185 4.6584 1.75 5.17042 1.75 5.6875C1.75 6.20458 1.85185 6.7166 2.04972 7.19432C2.2476 7.67204 2.53764 8.1061 2.90327 8.47173C3.2689 8.83736 3.70296 9.1274 4.18068 9.32528C4.6584 9.52315 5.17042 9.625 5.6875 9.625Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_10_877">
              <path d="M0 0H14V14H0V0Z" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <input
        placeholder={placeholder}
        className="bg-transparent text-sm text-gray-400 w-full ml-2 border-none focus:outline-none"
      />
    </div>
  );
}
