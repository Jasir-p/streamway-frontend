import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Send,
  Trash,
  Archive,
  Star,
  Clock,
  ChevronDown,
  Tag,
  CheckCircle,
  Inbox,
  Calendar,
  X,
  RefreshCcw,
  ArrowLeft, ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { fetchEmails } from '../../../../../redux/slice/EmailSlice';
import { useSelector, useDispatch } from 'react-redux';
import { EmailDetailModal } from './EmailDetail';
import ComposeEmailModal from './AddMail';
import ContactsModal from './ContactsModal';
import { useEmailPermissions } from '../../../authorization/useEmailPermissions';


export default function EmailManagementUI() {
  const [activeTab, setActiveTab] = useState('sent');
  const [emailDetailModal, setEmailDetailModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const { emails, loading,hasNext,hasPrevious,next,previous } = useSelector((state) => state.emails);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const role = useSelector((state) =>state.auth.role)
  const userID = useSelector((state) =>state.profile.id)
  const {canAdd,canEdit,canDelete}=useEmailPermissions()
  
  // New filter states
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  
  const dispatch = useDispatch();


    const fetchData = (url='/api/tenant-email/') => {
      const params = {
        userID: role !== 'owner' ? userID : null,
        url,
      };
      dispatch(fetchEmails(params));
    };

    useEffect(() => {
      fetchData();  // Initial load
    }, [dispatch, role, userID]);

    const handleNextPage = () => {
      if (hasNext) {
        fetchData(next);  
      }
    };

    const handlePreviousPage = () => {
      if (hasPrevious) {
        fetchData(previous); 
      }
    };

  const emailCategories = [
    { id: 'all', name: 'All Emails', count: 256 },
    { id: 'follow_up', name: 'Follow-up', count: 42 },
    { id: 'aftersale', name: 'After Sale', count: 38 },
    { id: 'leads', name: 'Leads', count: 87 },
  ];

  // Helper function to check if date is within range
  const isDateInRange = (emailDate, filter) => {
    const today = new Date();
    const emailDateObj = new Date(emailDate);
    
    switch(filter) {
      case 'today':
        return emailDateObj.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return emailDateObj >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return emailDateObj >= monthAgo;
      case 'custom':
        if (!customDateRange.start || !customDateRange.end) return true;
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        return emailDateObj >= startDate && emailDateObj <= endDate;
      default:
        return true;
    }
  };

  // Enhanced filtering logic
  const filteredEmails = emails.filter(email => {
    // Category filter
    const categoryMatch = activeCategory === 'all' || email.category === activeCategory;
    
  
    const dateMatch = dateFilter === 'all' || isDateInRange(email.sent_at, dateFilter);
    
    

    const deliveryMatch = deliveryFilter === 'all' || 
      (deliveryFilter === 'delivered' && email.is_sent) ||
      (deliveryFilter === 'failed' && !email.is_sent);
    
    return categoryMatch && dateMatch && deliveryMatch;
  });

  const openEmailDetailModal = (email) => {
    setSelectedEmail(email);
    setEmailDetailModal(true);
  };

  const handleComposeEmail = () => {
    setShowComposeModal(true);
  };

  const handleSelectContact = () => {
    setShowContactsModal(true);
  };
  
  const selected = (contact) => {
    setShowContactsModal(false);
    setSelectedContact(contact);
    
  }

  const clearFilters = () => {
    setDateFilter('all');
    setDeliveryFilter('all');
    setCustomDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = dateFilter !== 'all' || deliveryFilter !== 'all';

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            {canAdd &&(<button
              onClick={handleComposeEmail}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Send size={16} />
              <span>Compose</span>
            </button>)}
            
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">Categories</div>
              <ul>
                {emailCategories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md ${activeCategory === category.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center">
                        <Tag size={16} className="mr-2" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search sent emails..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </div>
              </div>


                <div className="flex items-center gap-4">
                  {/* Previous Button */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={!hasPrevious}
                    className={`p-2 rounded-full ${
                      hasPrevious
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!hasNext}
                    className={`p-2 rounded-full ${
                      hasNext
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>


              <div className="flex items-center gap-2">
                
                <button onClick={fetchData} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                  <RefreshCcw className="w-4 h-4" />
                  Refresh
                </button>
                <div className="relative">
                  
                   <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-1 rounded-md px-3 py-1.5 ${hasActiveFilters ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                    <ChevronDown size={16} />
                    {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </button>

                  {/* Filter Dropdown */}
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">Filters</h3>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Clear all
                            </button>
                          )}
                        </div>

                        {/* Date Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar size={16} className="inline mr-1" />
                            Date Range
                          </label>
                          <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">Last Month</option>
                            <option value="custom">Custom Range</option>
                          </select>

                          {dateFilter === 'custom' && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                value={customDateRange.start}
                                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="date"
                                value={customDateRange.end}
                                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          )}
                        </div>

                        {/* Delivery Status Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CheckCircle size={16} className="inline mr-1" />
                            Delivery Status
                          </label>
                          <select
                            value={deliveryFilter}
                            onChange={(e) => setDeliveryFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Status</option>
                            <option value="delivered">Delivered</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setShowFilters(false)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {dateFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {dateFilter === 'custom' ? 'Custom Date' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                    <button
                      onClick={() => setDateFilter('all')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {deliveryFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {deliveryFilter.charAt(0).toUpperCase() + deliveryFilter.slice(1)}
                    <button
                      onClick={() => setDeliveryFilter('all')}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Sent Emails ({filteredEmails.length})
              </h2>
            </div>

            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Send size={48} />
                <p className="mt-2">No sent emails match your filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredEmails.map(email => (
                  <li
                    key={email.id}
                    onClick={() => openEmailDetailModal(email)}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedEmail?.id === email.id ? 'bg-blue-100' : 'bg-white'}`}
                  >
                    <div className="p-4 flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600`}>
                          {email.recipient?.name.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">To: {email?.recipient_name}</p>
                          <p className="text-xs text-gray-500">{email.created_At}</p>
                        </div>

                        <p className="text-sm font-medium text-gray-900">{email.subject}</p>

                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 truncate">{email.recipient_email}</span>
                        </div>

                        <div className="flex items-center mt-2">
                          {email.category === 'followup' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock size={12} className="mr-1" />
                              Follow-up
                            </span>
                          )}

                          {email.category === 'aftersale' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              <Tag size={12} className="mr-1" />
                              After Sale
                            </span>
                          )}

                          {email.category === 'won' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Won Deal
                            </span>
                          )}

                          {email.category === 'leads' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              <Users size={12} className="mr-1" />
                              Lead
                            </span>
                          )}

                          {email.is_sent ? (
                            <span className="ml-2 text-green-500 text-xs flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Delivered
                            </span>
                          ) : (
                            <span className="ml-2 text-red-500 text-xs flex items-center">
                              <X size={12} className="mr-1" />
                              Failed
                            </span>
                          )}

                          {email.flagged && (
                            <span className="ml-2 text-yellow-500">
                              <Star size={16} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </div>

        {emailDetailModal && (
          <EmailDetailModal
            email={selectedEmail}
            isOpen={emailDetailModal}
            onClose={() => setEmailDetailModal(false)}
          />
        )}

        <ComposeEmailModal
          isOpen={showComposeModal}
          onClose={() => setShowComposeModal(false)}
          onSelectContact={handleSelectContact}
          contacts={selectedContact}
        />

        <ContactsModal
          isOpen={showContactsModal}
          onClose={() => setShowContactsModal(false)}
          onSelectContact={selected}
        />
        
      </div>
    </DashboardLayout>
  );
}