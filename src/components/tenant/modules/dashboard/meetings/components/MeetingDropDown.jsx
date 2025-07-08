
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { fetchAccounts } from '../../../../../../redux/slice/AccountsSlice';
import { useDispatch } from 'react-redux';
import { selectContactByAccount } from '../../../../../../Intreceptors/ActivityApiHandle';

export const AccountDropdown = ({ isOpen, onSelect, onClose, selectedAccount, placeholder = 'Select account', className = '' }) => {
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {accounts, next,previous} = useSelector((state)=>state.accounts)
  const itemsPerPage = 5;
  const dispatch = useDispatch();
useEffect(()=>{
  dispatch(fetchAccounts());
  
},[dispatch])
  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset search and pagination when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handlePrevPage = () => {
 
      dispatch(fetchAccounts(previous));
    
  };

  const handleNextPage = () => {
    dispatch(fetchAccounts(next))
    
  };

  const handleAccountSelect = (account) => {
    onSelect(account);
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 w-full bg-white rounded-lg shadow-lg text-gray-800 z-50 border border-gray-200 ${className}`}
    >
      {/* Header with search */}
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-2">
          {placeholder}
        </div>
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Accounts list */}
      <div className="max-h-64 overflow-y-auto">
        {currentAccounts.length > 0 ? (
          currentAccounts.map(account => (
            <div 
              key={account.id}
              className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                selectedAccount?.id === account.id ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => handleAccountSelect(account)}
            >
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                {account.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{account.name}</div>
                <div className="text-xs text-gray-500">{account.email} contacts</div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            {searchTerm ? 'No accounts match your search' : 'No accounts available'}
          </div>
        )}
      </div>

      {/* Pagination footer */}
     {(next || previous) && (
  <div className="flex justify-between items-center py-4">
    <div className="text-sm text-gray-600">
      Showing {startIndex + 1}-{Math.min(endIndex, filteredAccounts.length)} of {filteredAccounts.length}
    </div>
    
    <div className="flex items-center gap-4">
      {/* Previous Arrow */}
      <div 
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          !previous 
            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' 
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 cursor-pointer'
        }`}
        onClick={previous ? handlePrevPage : undefined}
      >
        <ChevronLeft size={20} />
      </div>
      

      <span className="text-sm font-medium text-gray-700 min-w-20 text-center">
        {currentPage} of {totalPages}
      </span>
      

      <div 
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          !next 
            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' 
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 cursor-pointer'
        }`}
        onClick={next ? handleNextPage : undefined}
      >
        <ChevronRight size={20} />
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Contact Dropdown Component
export const ContactDropdown = ({ isOpen, onSelect, onClose, selectedContact, account, placeholder = 'Select contact', className = '' }) => {
  const dropdownRef = useRef(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  useEffect(() => {
    const fetchContacts = async () => {
      
      try {
        const response = await selectContactByAccount(account.id);
        setContacts(Array.isArray(response) ? response : response ? [response] : []);
      } catch (error) {
        
        setContacts([]);
      } finally {
        
      }
    };
    
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 w-full bg-white rounded-lg shadow-lg text-gray-800 z-50 py-2 border border-gray-200 ${className}`}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
        {placeholder}
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <div 
              key={contact.id}
              className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                selectedContact?.id === contact.id ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => onSelect(contact)}
            >
              <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                {contact.name?.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{contact.name}</div>
                <div className="text-xs text-gray-500">{contact.department}</div>
                <div className="text-xs text-gray-400">{contact.email}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No contacts available
          </div>
        )}
      </div>
    </div>
  );
};
