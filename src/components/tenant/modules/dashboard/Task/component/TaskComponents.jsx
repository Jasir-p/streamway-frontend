import { Icon,ChevronLeft,ChevronRight } from "lucide-react";


export const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && '*'}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export const SelectField = ({ options, value, onChange, placeholder, error, name, ...props }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
    {...props}
  >
    <option value="">{placeholder}</option>
    {options?.map(option => (
      <option key={option.value || option.id} value={option.value || option.id}>
        {option.label || option.name}
      </option>
    ))}
  </select>
);

export const PaginationArrows = ({ onPrev, onNext, hasPrev, hasNext }) => (
  <div className="flex items-center">
    {[
      { onClick: onPrev, disabled: !hasPrev, icon: ChevronLeft, label: "Previous" },
      { onClick: onNext, disabled: !hasNext, icon: ChevronRight, label: "Next" }
    ].map(({ onClick, disabled, icon: Icon, label }, idx) => (
      <button
        key={idx}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-1 rounded ${disabled ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label={`${label} page`}
      >
        <Icon size={16} />
      </button>
    ))}
  </div>
);

export const ListManager = ({ items, input, setInput, onAdd, onRemove, onToggle, placeholder, renderItem }) => (
  <>
    <div className="flex mb-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-l-md"
        placeholder={placeholder}
        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
      />
      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
      >
        Add
      </button>
    </div>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {items.length === 0 ? (
        <div className="text-gray-500 text-sm">No items added yet</div>
      ) : (
        items.map((item, index) => renderItem(item, index, onRemove, onToggle))
      )}
    </div>
  </>
);