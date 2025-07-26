import { useRef, useState, useEffect } from "react";

export const CategoryDropdown = ({ isOpen, onSelect, onClose }) => {
  const CATEGORY_CHOICES = [
    ['follow_up', 'Follow Up'],
    ['after_sale', 'After Sale'],
    ['leads', 'Leads'],
  ];

  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-800 z-50 py-2"
      style={{
        // Ensure dropdown doesn't go off-screen
        transform: 'translateX(0)',
        maxWidth: 'calc(100vw - 2rem)',
        minWidth: '200px'
      }}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
        Select category
      </div>

      {loading ? (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          Loading categories...
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {CATEGORY_CHOICES.length > 0 ? (
            CATEGORY_CHOICES.map(([value, label]) => (
              <div
                key={value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors duration-150 truncate"
                onClick={() => onSelect(value)}
                title={label} // Show full text on hover if truncated
              >
                {label}
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No categories found
            </div>
          )}
        </div>
      )}
    </div>
  );
};