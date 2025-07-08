// hooks/useContacts.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts,deleteContacts } from '../../../../../../redux/slice/contactSlice';
import { MassMail } from '../../../../../../Intreceptors/MassMailapi';

import { useToast } from '../../../../../common/ToastNotification';


export const useContacts = () => {
  const dispatch = useDispatch();
  const { contacts, error, next, previous, loading } = useSelector(state => state.contacts);
  const userId = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);
  const { showSuccess, showError } = useToast();

  const [change, setChange] = useState(false);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch, change]);

  const handleNext = () => {
    dispatch(fetchContacts(next));
  };

  const handlePrevious = () => {
    dispatch(fetchContacts(previous));
  };

  const handleBulkAction = async (action, selectedContacts, options = {}) => {
    const { assignedTo, selectedCategory } = options;

    try {
      if (action === 'delete') {
        await dispatch(deleteContacts(selectedContacts));
        showSuccess('Contacts deleted successfully');
      }
      
      if (action === 'mass_email') {
        const data = {
          "to_contacts": selectedContacts,
          "category": selectedCategory
        };
        await MassMail(data, { userId, role, dispatch, showError, showSuccess });
      }
      
    } catch (error) {
      
      showError("An error occurred");
    }
  };

  return {
    contacts,
    loading,
    error,
    next,
    previous,
    handleNext,
    handlePrevious,
    handleBulkAction,
    refreshContacts: () => setChange(prev => !prev)
  };
};

// hooks/useContactFilters.js
import { useMemo } from 'react';

export const useContactFilters = (contacts) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch =
        (contact?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (contact?.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (contact?.phone_number || '').includes(searchTerm || '');
      
      const matchesStatus = statusFilter === 'All' || 
        (contact?.status || '').toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let valueA = a?.[sortBy] ?? '';
      let valueB = b?.[sortBy] ?? '';
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [contacts, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    filteredContacts,
    handleSort
  };
};

// hooks/useContactSelection.js


export const useContactSelection = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const toggleSelectContact = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const toggleSelectAll = (filteredContacts) => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const clearSelection = () => {
    setSelectedContacts([]);
  };

  return {
    selectedContacts,
    toggleSelectContact,
    toggleSelectAll,
    clearSelection,
    hasSelection: selectedContacts.length > 0
  };
};

// hooks/useModal.js


export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const openModal = (contactData = null) => {
    setContact(contactData);
    setIsEdit(!!contactData); // true if contactData exists, false otherwise
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContact(null);
    setIsEdit(false);
  };

  const toggleModal = (contactData = null) => {
    if (isOpen) {
      closeModal();
    } else {
      openModal(contactData);
    }
  };

  return {
    isOpen,
    contact,
    isEdit,
    openModal,
    closeModal,
    toggleModal
  };
};


export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close
  };
};