import { useRef, useState, useEffect } from "react";

export const CategoryDropdown = ({ isOpen, onSelect, onClose }) => {
  const CATEGORY_CHOICES = [
    ['follow_up', 'Follow Up'],
    ['after_sale', 'After Sale'],
    ['leads', 'Leads'],
  ];

  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false); // optional if you simulate loading

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
      className="absolute top-12 mt-1 w-64 bg-white rounded-lg shadow-lg text-gray-800 z-10 py-2"
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
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
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => onSelect(value)}
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
