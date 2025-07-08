
import React, { useState } from 'react';
import DashboardLayout from '../../dashboard/DashbordLayout';

import { useContactFilters,useContactSelection,useContacts,useDropdown,useModal } from './contact/hooks/Contactshooks';

import ContactFilters from './contact/components/ContactFilters';

import ContactForm from './ContactForm';
import { UserDropdown } from '../../../common/ToolBar';
import { CategoryDropdown } from '../../../common/EmailCategory';
import ContactHeader from './contact/components/ContactHeader';
import ContactSearch from './contact/components/ContactSearch';
import BulkActions from './contact/components/BulkActioms';
import ContactTable from './contact/components/ContactTable';
import Pagination from './contact/components/Pagination';
import ConfirmationModal from './contact/components/ConfirmationModal';

const ContactView = () => {
  // Custom hooks for clean state management
  const { 
    contacts, 
    loading, 
    next, 
    previous, 
    handleNext, 
    handlePrevious, 
    handleBulkAction,
    refreshContacts 
  } = useContacts();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    filteredContacts,
    handleSort
  } = useContactFilters(contacts);

  const {
    selectedContacts,
    toggleSelectContact,
    toggleSelectAll,
    clearSelection,
    hasSelection
  } = useContactSelection();

  // Modal and dropdown states
  const contactModal = useModal();
  const statusDropdown = useDropdown();
  const bulkActionsDropdown = useDropdown();
  const userDropdown = useModal();
  const categoryDropdown = useModal();
  const confirmationModal = useModal();

  // Action states
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [assignedTo, setAssignedTo] = useState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showActionDropdown, setShowActionDropdown] = useState(null);

  // Event handlers
  const handleActionClick = (action) => {
    setActionToConfirm(action);
    bulkActionsDropdown.close();
    
    if (action === 'assign') {
      userDropdown.openModal();
    } else if (action === 'mass_email') {
      categoryDropdown.openModal();
    } else {
      confirmationModal.openModal();
    }
  };

  const handleConfirm = async () => {
    const options = {
      assignedTo,
      selectedCategory
    };
    
    await handleBulkAction(actionToConfirm, selectedContacts, options);
    
    // Clean up
    clearSelection();
    confirmationModal.closeModal();
    setActionToConfirm(null);
  };

  const handleCancel = () => {
    confirmationModal.closeModal();
    setActionToConfirm(null);
  };

  const handleUserSelect = (user) => {
    setAssignedTo(user.id);
    userDropdown.closeModal();
    confirmationModal.openModal();
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    categoryDropdown.closeModal();
    confirmationModal.openModal();
  };

  const toggleFavorite = (id) => {
    // Implementation for toggling favorite
    
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading contacts...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-lg p-6 max-l w-full">
        {/* Header */}
        <ContactHeader onAddContact={contactModal.openModal} />

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <ContactSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <div className="relative">
            <div className="flex gap-2">
              <ContactFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                showStatusDropdown={statusDropdown.isOpen}
                setShowStatusDropdown={statusDropdown.toggle}
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedContacts.length}
            dropdownOpen={bulkActionsDropdown.isOpen}
            setDropdownOpen={bulkActionsDropdown.toggle}
            onActionClick={handleActionClick}
          />
        </div>

        {/* Contact Table */}
        <ContactTable
          filteredContacts={filteredContacts}
          selectedContacts={selectedContacts}
          sortBy={sortBy}
          onSort={handleSort}
          onToggleSelectAll={() => toggleSelectAll(filteredContacts)}
          onToggleSelect={toggleSelectContact}
          onToggleFavorite={toggleFavorite}
          showActionDropdown={showActionDropdown}
          setShowActionDropdown={setShowActionDropdown}
          onChange = {refreshContacts}
          onEdit={contactModal}
        />

        {/* Pagination */}
        <Pagination
          currentCount={filteredContacts.length}
          totalCount={contacts.length}
          hasNext={!!next}
          hasPrevious={!!previous}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        {/* Modals and Dropdowns */}
        {contactModal.isOpen && (
          <ContactForm 
            isOpen={contactModal.isOpen} 
            onClose={contactModal.closeModal} 
            onChange={refreshContacts}
            contact={contactModal.contact}
            isEdit={contactModal.isEdit}
          />
        )}


        {categoryDropdown.isOpen && (
          <CategoryDropdown
            isOpen={categoryDropdown.isOpen}
            onSelect={handleCategorySelect}
            onClose={categoryDropdown.closeModal}
          />
        )}

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          actionType={actionToConfirm}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
};

export default ContactView;