import React, { useState } from 'react';
import { Plus, Download, RefreshCw, Tag, DollarSign, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import DashbordLoading from '../../../../common/DashbordLoading';

import Swal from 'sweetalert2';
// Custom Hooks

import { useDealsData } from './hooks/useDealsData';
import { useDealsFilters } from './hooks/useDealsFilters';
import { useDealsSelection } from './hooks/useDealsSelection';
import { usePagination } from './hooks/usePagination';


import { SearchAndFilters } from './components/SearchAndFilters';
import { StatsCard } from './components/StatsCard';
import { BulkActions } from './components/BulkActions';
import { Pagination } from './components/Pagination';
import { ActionButton } from './components/ActionButton';
import { DealsTable } from './components/DealsTable';

// Modals
import AddDealModal from './DealForm';
import BulkEditModal from './BulkEditModal';

// Utils
import { dealsUtils } from './utils/dealsUtils';
import { EmptyState } from './components/EmptyState';
import { deleteDealsBulk } from '../../../../../redux/slice/DealSlice';
import { useDispatch } from 'react-redux';
const DealsListPage = () => {
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const dispatch = useDispatch();

  // Custom hooks
  const { 
    deals, 
    loading, 
    error, 
    role, 
    userID,
    next,
    previous,
    employees,
    onNext,
    onPrevious,
    refreshDeals, 
    handleBulkUpdate 
  } = useDealsData();

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    setFilters,
    filteredDeals,
    activeFiltersCount,
    
    clearFilters
  } = useDealsFilters(deals);

  const {
    selectedDeals,
    toggleDealSelection,
    selectAllDeals,
    clearSelection
  } = useDealsSelection();


  const {
    currentPage,
    setCurrentPage,
    paginatedItems: paginatedDeals,
    totalPages,
    startIndex,
    totalItems
  } = usePagination(filteredDeals);

  // Event handlers
  const onBulkUpdate = async (dealIds, updates) => {
    try {
      const result = await handleBulkUpdate(dealIds, updates);
      if (result.success) {
        clearSelection();
        alert(`Successfully updated ${dealIds.length} deals`);
      }
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };
const handleDeleteDeal = (dealId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to recover this deal!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(deleteDealsBulk([dealId])) 
        .then(() => {
          Swal.fire({
            title: 'Deleted!',
            text: 'The deal has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete the deal.',
            icon: 'error',
          });
        });
    }
  });
};

  const handleEditDeal = (dealId) => {
    const dealToEdit = deals.find(deal => deal.deal_id === dealId);
    if (dealToEdit) {
      setEditingDeal(dealToEdit);
      setIsEditModalOpen(true);
    }
  };
    const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDeal(null);
  };
  if (loading) return <DashbordLoading />;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
            <p className="text-gray-600">
              {filteredDeals.length} deals found
              {activeFiltersCount > 0 && ` (${activeFiltersCount} filters applied)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Deal
            </button>
            <ActionButton icon={Download} />
            <ActionButton icon={RefreshCw} onClick={refreshDeals} />
          </div>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          activeFiltersCount={activeFiltersCount}
          clearFilters={clearFilters}
          employees ={employees}
        />

        {/* Bulk Actions */}
        {selectedDeals.length > 0 && (
          <BulkActions
            selectedCount={selectedDeals.length}
            onBulkEdit={() => setShowBulkEditModal(true)}
            onBulkDelete={() => console.log('Delete selected')}
            onClearSelection={clearSelection}
          />
        )}

        {/* Deals Table or Empty State */}
        {filteredDeals.length === 0 ? (
          <EmptyState
            hasFilters={searchTerm || activeFiltersCount > 0}
            onClearFilters={clearFilters}
            onCreateDeal={() => setIsOpen(true)}
          />
        ) : (
          <>
            <DealsTable
              deals={deals}
              selectedDeals={selectedDeals}
              onToggleSelection={toggleDealSelection}
              onSelectAll={() => selectAllDeals(paginatedDeals)}
              onEdit={handleEditDeal}
              onDelete={handleDeleteDeal}
            />
            
            {/* Pagination */}
            {(next || previous) && (
              <Pagination
                hasPrevious={!!previous}
                hasNext={!!next}
                onNext={onNext}
                onPrevious={onPrevious}
              />
            )}

          </>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <StatsCard 
            icon={Tag} 
            value={filteredDeals.length} 
            label="Total Deals" 
            bgColor="bg-blue-100" 
            iconColor="text-blue-600" 
          />
          <StatsCard 
            icon={DollarSign} 
           value={dealsUtils.formatAmount(
  filteredDeals.reduce((sum, deal) => sum + parseFloat(deal.amount || 0), 0)
)}
 
            label="Total Value" 
            bgColor="bg-green-100" 
            iconColor="text-green-600" 
          />
          <StatsCard 
            icon={Clock} 
            value={filteredDeals.filter(deal => deal.status === 'in_progress').length} 
            label="In Progress" 
            bgColor="bg-yellow-100" 
            iconColor="text-yellow-600" 
          />
          <StatsCard 
            icon={CheckCircle} 
            value={`${Math.round(filteredDeals.reduce((sum, deal) => sum + (deal.probability || 0), 0) / filteredDeals.length) || 0}%`} 
            label="Avg. Probability" 
            bgColor="bg-purple-100" 
            iconColor="text-purple-600" 
          />
        </div>

        {/* Modals */}
        {isOpen && (
          <AddDealModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            role={role}
            userId={userID}
            onSuccess={refreshDeals}
          />
        )}
        {isEditModalOpen && (
          <AddDealModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            role={role}
            userId={userID}
            onSuccess={() => {
              refreshDeals();
              handleCloseEditModal();
            }}
            dealData={editingDeal}
            isEditing={true}
          />
        )}

        <BulkEditModal
          isOpen={showBulkEditModal}
          onClose={() => setShowBulkEditModal(false)}
          selectedDeals={selectedDeals}
          deals={deals}
          onBulkUpdate={onBulkUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default DealsListPage;