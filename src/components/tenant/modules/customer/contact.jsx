import React, { useEffect, useState } from 'react';
import { Search, X, MoreHorizontal, Filter, ChevronDown, Phone, Mail, Edit, Trash, User, Plus, UserPlus, Download, Star, StarOff, ArrowUpDown, Eye } from 'lucide-react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { fetchContacts } from '../../../../redux/slice/contactSlice';
import { useDispatch,useSelector } from 'react-redux';
import userprofile from "../../../../assets/user-profile.webp";

const ContactView = () => {
  // Sample contact data
  const [contactss, setContacts] = useState([
    { id: 1, name: 'John', email: 'john.smith@example.com', phone: '(555) 123-4567', status: 'Active', favorite: true, lastContact: '2 days ago', company: 'Acme Inc.' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '(555) 987-6543', status: 'Inactive', favorite: false, lastContact: '1 week ago', company: 'TechCorp' },
    { id: 3, name: 'Michael Brown', email: 'michael.b@example.com', phone: '(555) 456-7890', status: 'Active', favorite: false, lastContact: 'Today', company: 'Global Solutions' },
    { id: 4, name: 'Jessica Williams', email: 'jessica.w@example.com', phone: '(555) 234-5678', status: 'Lead', favorite: true, lastContact: '3 days ago', company: 'Innovate Ltd' },
    { id: 5, name: 'David Miller', email: 'david.m@example.com', phone: '(555) 345-6789', status: 'Active', favorite: false, lastContact: 'Yesterday', company: 'Atlas Group' },
  ]);

  //redux
  const dispatch = useDispatch();
  const {contacts, error, next, previous, loading} = useSelector(state => state.contacts);
  console.log(contacts)
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedContacts, setSelectedContacts] = useState([]);

  
  // Delete contact handler
  const handleNext = () => {
    console.log(next)
    dispatch(fetchContacts(next));
    };
    const handlePrevious = () => {
      dispatch(fetchContacts(previous));
      };

  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };
  useEffect(()=>{
    dispatch(fetchContacts());
  },[])

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? {...contact, favorite: !contact.favorite} : contact
    ));
  };

  // Select/deselect contact
  const toggleSelectContact = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  // Select all contacts
  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (action === 'delete') {
      setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
    }
  };

  // Sort contacts
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  let filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone_number.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  filteredContacts = [...filteredContacts].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

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
  const statusOptions = ['All', 'Active', 'Inactive', 'Lead'];

  return (
    <DashboardLayout>
      <div className="bg-white  rounded-lg shadow-lg p-6 max-w-6xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
            <p className="text-gray-500 mt-1">Manage your contacts and leads</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm text-gray-600">{selectedContacts.length} selected</span>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded"
                >
                  <Trash size={16} />
                </button>
              </div>
            )}
            <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <UserPlus size={16} />
              Add Contact
            </button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or company..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative inline-block">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <Filter size={16} className="text-gray-500" />
                  <span>Status: {statusFilter}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute mt-1 right-0 z-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
                        }}
                      >
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          status === 'Active' ? 'bg-green-500' :
                          status === 'Inactive' ? 'bg-gray-400' :
                          status === 'Lead' ? 'bg-blue-500' : 'bg-transparent'
                        }`}></span>
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact List */}
        <div className="border border-gray-50 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3">
                  <button 
                    className="flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortBy === 'name' && (
                      <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                
                <th className="px-4 py-3">
                  <button 
                    className="flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortBy === 'status' && (
                      <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleSelectContact(contact.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium">
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900 flex items-center">
                          {contact.name}
                          <button 
                            className="ml-2 text-gray-400 hover:text-yellow-500"
                            onClick={() => toggleFavorite(contact.id)}
                          >
                            {contact.favorite ? 
                              <Star size={16} className="fill-yellow-400 text-yellow-400" /> : 
                              <StarOff size={16} />
                            }
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {contact.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {contact.phone_number}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === 'Active' ? 'bg-green-100 text-green-800' :
                        contact.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        <span className={`w-2 h-2 mr-1 rounded-full ${
                          contact.status === 'Active' ? 'bg-green-500' :
                          contact.status === 'Inactive' ? 'bg-gray-500' :
                          'bg-blue-500'
                        }`}></span>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                                            <div className="flex items-center space-x-3">
                                              <img
                                                src={userprofile}
                                                alt="User"
                                                className="w-8 h-8 rounded-full"
                                              />
                                              <div className="text-sm font-medium text-gray-900">
                                                {contact.lead?.employee?.name}
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                  {contact.lead?.employee?.role?.name}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                      </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.lastContact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-indigo-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Edit size={18} />
                        </button>
                        <button 
                          className="p-1 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash size={18} />
                        </button>
                        <div className="relative">
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                            onClick={() => setShowActionDropdown(showActionDropdown === contact.id ? null : contact.id)}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          
                          {showActionDropdown === contact.id && (
                            <div className="absolute right-0 mt-1 z-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Add to Campaign
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Add Note
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Schedule Meeting
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                Delete Contact
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
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
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{contacts.length}</span> contacts
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50" onClick={handlePrevious}>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContactView;