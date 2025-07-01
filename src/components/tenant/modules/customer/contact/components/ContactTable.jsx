import React from 'react';
import { Search } from 'lucide-react';
import ContactTableHeader from './ContactTableHeader';
import ContactRow from './ContactRow';

const ContactTable = ({ 
  filteredContacts,
  selectedContacts,
  sortBy,
  onSort,
  onToggleSelectAll,
  onToggleSelect,
  onToggleFavorite,
  showActionDropdown,
  setShowActionDropdown,
  onChange,
  onEdit
}) => {
  return (
    <div className="border border-gray-50 rounded-lg  shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <ContactTableHeader
          sortBy={sortBy}
          onSort={onSort}
          selectedContacts={selectedContacts}
          filteredContacts={filteredContacts}
          onToggleSelectAll={onToggleSelectAll}
        />
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <ContactRow
                key={contact.id}
                contact={contact}
                isSelected={selectedContacts.includes(contact.id)}
                onToggleSelect={onToggleSelect}
                onToggleFavorite={onToggleFavorite}
                showActionDropdown={showActionDropdown}
                onShowActionDropdown={setShowActionDropdown}
                onChange = {onChange}
                onEdit={onEdit}

              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <Search size={32} className="text-gray-300 mb-2" />
                  <p className="text-gray-500 mb-1">No contacts found matching your criteria</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filter settings</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;