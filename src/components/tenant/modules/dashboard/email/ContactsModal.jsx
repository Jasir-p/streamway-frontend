import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';
import { fetchContacts } from '../../../../../redux/slice/contactSlice';
import { fetchAccounts } from '../../../../../redux/slice/AccountsSlice';


export default function ContactsModal({ isOpen, onClose, onSelectContact }) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('lead'); // Default to 'lead'
  const [leadsPage, setLeadsPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const [accountsPage, setAccountsPage] = useState(1);

  const userID = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);
  const { leads, next: leadsNext, previous: leadsPrevious } = useSelector((state) => state.leads);
  const { contacts, next: contactsNext, previous: contactsPrevious } = useSelector((state) => state.contacts);
  const { accounts, next: accountsNext, previous: accountsPrevious } = useSelector((state) => state.accounts);

  // Fetch data based on pagination
  useEffect(() => {
    if (role === 'owner') {
      dispatch(fetchLeadsOwner());
    } else {
      dispatch(fetchLeadsEmployee(userID));
    }
  }, [dispatch, role, userID, leadsPage]);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch, contactsPage]);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch, accountsPage]);

  // Combine all data for filtering
  const allData = [
    ...leads.map((lead) => ({ ...lead, type: 'lead', id: lead.lead_id, name: lead.name || 'Unknown' })),
    ...contacts.map((contact) => ({ ...contact, type: 'contact', email: contact.email || 'No email' })),
    ...accounts.map((account) => ({ ...account, type: 'account', email: account.email || 'No email' })),
  ];

  // Filter data based on search query and active filter
  const filteredData = allData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) && item.type === activeFilter
  );

  // Pagination logic
  const contactsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / contactsPerPage);
  const indexOfLastContact = leadsPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentData = filteredData.slice(indexOfFirstContact, indexOfLastContact);

  // Pagination handlers
  const handleNextPage = () => {
    if (activeFilter === 'lead' && leadsNext) {
      setLeadsPage((prev) => prev + 1);
      if (role === 'owner') {
        dispatch(fetchLeadsOwner(leadsNext));
      } else {
        dispatch(fetchLeadsEmployee(userID, leadsNext));
      }
    } else if (activeFilter === 'contact' && contactsNext) {
      setContactsPage((prev) => prev + 1);
      dispatch(fetchContacts(contactsNext));
    } else if (activeFilter === 'account' && accountsNext) {
      setAccountsPage((prev) => prev + 1);
      dispatch(fetchAccounts(accountsNext));
    }
  };

  const handlePrevPage = () => {
    if (activeFilter === 'lead' && leadsPrevious) {
      setLeadsPage((prev) => prev - 1);
      if (role === 'owner') {
        dispatch(fetchLeadsOwner(leadsPrevious));
      } else {
        dispatch(fetchLeadsEmployee(userID, leadsPrevious));
      }
    } else if (activeFilter === 'contact' && contactsPrevious) {
      setContactsPage((prev) => prev - 1);
      dispatch(fetchContacts(contactsPrevious));
    } else if (activeFilter === 'account' && accountsPrevious) {
      setAccountsPage((prev) => prev - 1);
      dispatch(fetchAccounts(accountsPrevious));
    }
  };

  // Reset page to 1 when changing filters
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setLeadsPage(1);
    setContactsPage(1);
    setAccountsPage(1);
  };

  // Handle contact selection
  const handleContactSelect = (item) => {
    onSelectContact(item); // Pass selected item back to parent
    onClose(); // Close modal after selection
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Select Contact</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
            </div>
          </div>

          <div className="flex mb-4 border-b border-gray-200">
            <button
              className={`px-4 py-2 ${
                activeFilter === 'lead'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleFilterChange('lead')}
            >
              Leads
            </button>
            <button
              className={`px-4 py-2 ${
                activeFilter === 'contact'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleFilterChange('contact')}
            >
              Contacts
            </button>
            <button
              className={`px-4 py-2 ${
                activeFilter === 'account'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleFilterChange('account')}
            >
              Accounts
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <li className="py-4 text-center text-gray-500">No {activeFilter}s found</li>
              ) : (
                currentData.map((item) => (
                  <li
                    key={item.id}
                    className="py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleContactSelect(item)}
                  >
                    <div className="flex items-center px-2">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {item.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {item.type === 'lead' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Lead
                          </span>
                        )}
                        {item.type === 'contact' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Contact
                          </span>
                        )}
                        {item.type === 'account' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs

 font-medium bg-purple-100 text-purple-800">
                            Account
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Pagination Controls */}
          {(activeFilter === 'lead' ? leadsNext || leadsPrevious : activeFilter === 'contact' ? contactsNext || contactsPrevious : accountsNext || accountsPrevious) && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={
                  activeFilter === 'lead'
                    ? !leadsPrevious
                    : activeFilter === 'contact'
                    ? !contactsPrevious
                    : !accountsPrevious
                }
                className="p-2 border border-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <span>
                Page{' '}
                {activeFilter === 'lead' ? leadsPage : activeFilter === 'contact' ? contactsPage : accountsPage}
              </span>
              <button
                onClick={handleNextPage}
                disabled={
                  activeFilter === 'lead'
                    ? !leadsNext
                    : activeFilter === 'contact'
                    ? !contactsNext
                    : !accountsNext
                }
                className="p-2 border border-gray-200 rounded-full disabled:opacity Ignoring disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              className="mr-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}