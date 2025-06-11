// import React, { useEffect, useState,useRef } from 'react';
// import { Search, X, MoreHorizontal, Filter, ChevronDown, Phone, Mail, Edit, Trash, User, Plus, UserPlus, Download, Star, StarOff, ArrowUpDown, Eye,MoreVertical,AlertTriangle } from 'lucide-react';
// import DashboardLayout from '../../dashboard/DashbordLayout';
// import { fetchContacts,deleteContacts } from '../../../../redux/slice/contactSlice';
// import { useDispatch,useSelector } from 'react-redux';
// import userprofile from "../../../../assets/user-profile.webp";
// import ContactForm from './ContactForm';
// import { UserDropdown } from '../../../common/ToolBar';
import { assignToContact } from '../../../../Intreceptors/CustomerApi';
// import { useToast } from '../../../common/ToastNotification';
// import { CategoryDropdown } from '../../../common/EmailCategory';
// import { MassMail } from '../../../../Intreceptors/MassMailapi';


 

// const ContactView = () => {

//   const dispatch = useDispatch();
//   const {contacts, error, next, previous, loading} = useSelector(state => state.contacts);
//   console.log(contacts)
//   // State management
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [showActionDropdown, setShowActionDropdown] = useState(null);
//   const [sortBy, setSortBy] = useState('name');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [isModal, setIsModal]= useState(false)
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const [isuserDropdown,setUserDropdown]= useState(false)
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [actionToConfirm, setActionToConfirm] = useState(null);
//   const [assignedTo, setAssignedTo]= useState()
//   const { showSuccess, showError } = useToast();
//   const[change,setChange]=useState(false)
//   const userId = useSelector((state) => state.profile.id);
//     const role = useSelector((state) => state.auth.role);
//   console.log(isModal);
//   const confirmationRef = useRef(null);

//   const [emailCategory, setEmailCategory] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState('')
//   const actionConfigs = {
//     mass_email: {
//       title: "Send Mass Email",
//       message: "Are you sure you want to send an email to the selected contacts?",
//       icon: <Mail size={18} className="text-blue-500" />
//     },
//     assign: {
//       title: "Assign Contacts",
//       message: "Are you sure you want to reassign the selected contacts?",
//       icon: <UserPlus size={18} className="text-green-500" />
//     },
//     delete: {
//       title: "Delete Contacts",
//       message: "Are you sure you want to delete the selected contacts? This action cannot be undone.",
//       icon: <Trash size={18} className="text-red-500" />
//     }
//   };
  


//   const handleNext = () => {
//     console.log(next)
//     dispatch(fetchContacts(next));
//     };
//     const handlePrevious = () => {
//       dispatch(fetchContacts(previous));
//       };

//   useEffect(()=>{
//     dispatch(fetchContacts());
//   },[dispatch,change])


//   const toggleFavorite = (id) => {
//     setContacts(contacts.map(contact => 
//       contact.id === id ? {...contact, favorite: !contact.favorite} : contact
//     ));
//   };


//   const toggleSelectContact = (id) => {
//     if (selectedContacts.includes(id)) {
//       setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
//     } else {
//       setSelectedContacts([...selectedContacts, id]);
//     }
//   };


//   const toggleSelectAll = () => {
//     if (selectedContacts.length === filteredContacts.length) {
//       setSelectedContacts([]);
//     } else {
//       setSelectedContacts(filteredContacts.map(contact => contact.id));
//     }
//   };

//   const handleActionClick = (action) => {
//     setActionToConfirm(action);
    
//     if (action === 'assign') {
//       setUserDropdown(true);
      
//     }
//     if (action === 'mass_email') {
//       setEmailCategory(true)
//     }
//      else {
//       setShowConfirmation(true);
//     }
    
//     setDropdownOpen(false);
//   };
  

//   const handleConfirm = () => {
//     handleBulkAction(actionToConfirm);
//     setShowConfirmation(false);
//     setActionToConfirm(null);
//   };

//   const handleCancel = () => {
//     setShowConfirmation(false);
//     setActionToConfirm(null);
//   };
// const handleBulkAction = async(action) => {
//   if (action === 'delete') {
//     dispatch(deleteContacts(selectedContacts));
//     setSelectedContacts([]);
//   }
//   if (action === 'mass_email') {
//     console.log("working");
    
//     const data = {
//       "to_contacts" :selectedContacts,
//       "category":selectedCategory
//     }
//     const response = MassMail(data,{userId,role,dispatch,showError,showSuccess})
  
//   }
//   if (action === 'assign') {
//     const data = {'assigned_to':assignedTo,
//       'assigned_by':role ==="owner"? null:userId,
//       'contact_id':selectedContacts
//       }
//   console.log(data);
  
//   try {
//     const response = await assignToContact(data);
//     console.log(response.data);
    
//     if (response.status === 200) {
//       console.log(response.data);
//       setChange(true);
//       showSuccess(response.data?.message);
      
//     } else {

//       console.error("Something went wrong:", response);
//     }
//   } catch (error) {
//     console.error(error);

//   }
//   setSelectedContacts([])
// };

    
//   }

//   const SelectedUser = (user) => {
//     setAssignedTo(user.id)
//     setUserDropdown(false);

//     setShowConfirmation(true);

//   }

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('asc');
//     }
//   };

//   const selctMailCategory = (category)=>{
//     setEmailCategory(false)
//     console.log("halooo",category)
//     setSelectedCategory(category)
//     setShowConfirmation(true)

//   }
//   console.log(selectedContacts);
//   let filteredContacts = contacts.filter(contact => {
//     const matchesSearch =
//       (contact?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
//       (contact?.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
//       (contact?.phone_number || '').includes(searchTerm || '');
  
//     const matchesStatus = statusFilter === 'All' || (contact?.status || '').toLowerCase() === statusFilter.toLowerCase();
  
//     return matchesSearch && matchesStatus;
//   });
//   filteredContacts = [...filteredContacts].sort((a, b) => {
//     let valueA = a?.[sortBy] ?? '';
//     let valueB = b?.[sortBy] ?? '';
  
//     if (typeof valueA === 'string') {
//       valueA = valueA.toLowerCase();
//       valueB = valueB.toLowerCase();
//     }
  
//     if (sortOrder === 'asc') {
//       return valueA > valueB ? 1 : -1;
//     } else {
//       return valueA < valueB ? 1 : -1;
//     }
//   });
//   const statusOptions = ['All', 'Active', 'Inactive',];

//   return (
//     <DashboardLayout>
//       <div className="bg-white  rounded-lg shadow-lg p-6 max-w-6xl w-full">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
//             <p className="text-gray-500 mt-1">Manage your contacts and leads</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {selectedContacts.length > 0 && (
//               <div className="flex items-center gap-2 mr-2 relative">
//               <span className="text-sm text-gray-600">{selectedContacts.length} selected</span>
            
//               <button 
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded"
//               >
//                 <MoreVertical size={18} />
//               </button>
            
//               {dropdownOpen && (
//                       <div className="absolute top-10 right-0 bg-white rounded shadow-md w-40 z-10">
//                         <button 
//                           onClick={() => handleActionClick('mass_email')}
//                           className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
//                         >
//                           <Mail size={14} className="mr-2" /> Mass Email
//                         </button>
//                         <button 
//                           onClick={() => handleActionClick('assign')}
//                           className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
//                         >
//                           <UserPlus size={14} className="mr-2" /> Assign
//                         </button>
//                         <button 
//                           onClick={() => handleActionClick('delete')}
//                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           <Trash size={14} className="mr-2" /> Delete
//                         </button>
//                       </div>
//                     )}


//                     {isuserDropdown && (
//                       <UserDropdown 
//                         isOpen={isuserDropdown} 
//                         onSelect={SelectedUser} 
//                         onClose={() => setUserDropdown(false)} 
//                       />
//                     )}
//                     {emailCategory &&(
//                       <CategoryDropdown
//                       isOpen={emailCategory}
//                       onSelect={selctMailCategory}
//                       onClose={()=>setEmailCategory(false)}/>
//                     )}
//             </div>
//             )}
//             {showConfirmation && actionToConfirm && (
//         <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
//           <div 
//             ref={confirmationRef}
//             className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
//           >
//             <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
//               <div className="flex items-center">
//                 {actionConfigs[actionToConfirm].icon}
//                 <h3 className="ml-2 text-lg font-medium text-gray-900">
//                   {actionConfigs[actionToConfirm].title}
//                 </h3>
//               </div>
//               <button 
//                 onClick={handleCancel}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             <div className="px-4 py-4">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 mt-0.5">
//                   <AlertTriangle size={20} className="text-amber-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-gray-700">
//                     {actionConfigs[actionToConfirm].message}
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
//               <button
//                 onClick={handleCancel}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
//                   actionToConfirm === 'delete' 
//                     ? 'bg-red-600 hover:bg-red-700' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
            
//             <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
//               <Download size={16} />
//               Export
//             </button>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
//             onClick={()=>setIsModal(true)}>
//               <UserPlus size={16} />
//               Add Contact
//             </button>
//           </div>
//         </div>
        
//         {/* Search and Filters */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name, email, phone, or company..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button 
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 onClick={() => setSearchTerm('')}
//               >
//                 <X size={18} className="text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>
          
//           <div className="relative">
//             <div className="flex gap-2">
//               <div className="relative inline-block">
//                 <button 
//                   className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
//                   onClick={() => setShowStatusDropdown(!showStatusDropdown)}
//                 >
//                   <Filter size={16} className="text-gray-500" />
//                   <span>Status: {statusFilter}</span>
//                   <ChevronDown size={16} className="text-gray-500" />
//                 </button>
                
//                 {showStatusDropdown && (
//                   <div className="absolute mt-1 right-0 z-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
//                     {statusOptions.map(status => (
//                       <button
//                         key={status}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                         onClick={() => {
//                           setStatusFilter(status);
//                           setShowStatusDropdown(false);
//                         }}
//                       >
//                         <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
//                           status === 'Active' ? 'bg-green-500' :
//                            'bg-gray-400'
//                         }`}></span>
//                         {status}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         {isModal &&(
//           <ContactForm isOpen={isModal} onClose={() => setIsModal(false)} onChange={()=>setChange(true)}/>
//         )}
        
//         {/* Contact List */}
//         <div className="border border-gray-50 rounded-lg overflow-hidden shadow-sm">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 rounded"
//                       checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
//                       onChange={toggleSelectAll}
//                     />
//                   </div>
//                 </th>
//                 <th className="px-4 py-3">
//                   <button 
//                     className="flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     onClick={() => handleSort('name')}
//                   >
//                     Name
//                     {sortBy === 'name' && (
//                       <ArrowUpDown size={14} className="ml-1 text-gray-400" />
//                     )}
//                   </button>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                
//                 <th className="px-4 py-3">
//                   <button 
//                     className="flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     onClick={() => handleSort('status')}
//                   >
//                     Status
//                     {sortBy === 'status' && (
//                       <ArrowUpDown size={14} className="ml-1 text-gray-400" />
//                     )}
//                   </button>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredContacts.length > 0 ? (
//                 filteredContacts.map(contact => (
//                   <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 text-blue-600 rounded"
//                           checked={selectedContacts.includes(contact.id)}
//                           onChange={() => toggleSelectContact(contact.id)}
//                         />
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0 mr-3 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium">
//                         {contact.name ? contact.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}

//                         </div>
//                         <div className="font-medium text-gray-900 flex items-center">
//                           {contact?.name}
//                           <button 
//                             className="ml-2 text-gray-400 hover:text-yellow-500"
//                             onClick={() => toggleFavorite(contact.id)}
//                           >
//                             {contact.favorite ? 
//                               <Star size={16} className="fill-yellow-400 text-yellow-400" /> : 
//                               <StarOff size={16} />
//                             }
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex flex-col">
//                         <div className="flex items-center text-sm text-gray-500 mb-1">
//                           <Mail size={14} className="mr-2 text-gray-400" />
//                           {contact.email}
//                         </div>
//                         <div className="flex items-center text-sm text-gray-500">
//                           <Phone size={14} className="mr-2 text-gray-400" />
//                           {contact?.phone_number}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         contact.status === 'active' ? 'bg-green-100 text-green-800' :
//                         contact.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                         <span className={`w-2 h-2 mr-1 rounded-full ${
//                           contact.status === 'active' ? 'bg-green-500' :
//                           'bg-gray-500' 
                          
//                         }`}></span>
//                         {contact?.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                      <div className="flex items-center">
//                                             <div className="flex items-center space-x-3">
//                                               <img
//                                                 src={userprofile}
//                                                 alt="User"
//                                                 className="w-8 h-8 rounded-full"
//                                               />
//                                               <div className="text-sm font-medium text-gray-900">
//                                                 {contact.assigned_to?.name}
//                                                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                                                   {contact.assigned_to?.role?.name}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                           </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                      <div className="flex items-center">
//                                             <div className="flex items-center ">
//                                               <img
//                                                 src={userprofile}
//                                                 alt="User"
//                                                 className="w-8 h-8 rounded-full"
//                                               />
//                                               <div className="text-sm font-medium text-gray-900">
//                                                 {contact.account_id.name}
                                                
//                                               </div>
//                                             </div>
//                                           </div>
//                       </td>
                      
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {contact.lastContact}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
//                       <div className="flex items-center justify-end space-x-2">
//                         <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//                           <Eye size={18} />
//                         </button>
//                         <button className="p-1 text-indigo-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
//                           <Edit size={18} />
//                         </button>
                        
//                         <div className="relative">
//                             <button 
//                               className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//                               onClick={() => setShowActionDropdown(showActionDropdown === contact.id ? null : contact.id)}
//                             >
//                               <MoreHorizontal size={18} />
//                             </button>

//                             {showActionDropdown === contact.id && (
//                               <div className="relative overflow-visible right-0 mt-2 z-20 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                                

//                                 <button 
//                                   onClick={() => {
//                                     handleBulkAction('add_note', contact);
//                                     setShowActionDropdown(null);
//                                   }}
//                                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   Status
//                                 </button>

//                                 <button 
//                                   onClick={() => {
//                                     handleBulkAction('schedule_meeting', contact);
//                                     setShowActionDropdown(null);
//                                   }}
//                                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   Schedule Meeting
//                                 </button>
//                               </div>
//                             )}
//                           </div>

//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                     <div className="flex flex-col items-center">
//                       <Search size={32} className="text-gray-300 mb-2" />
//                       <p className="text-gray-500 mb-1">No contacts found matching your criteria</p>
//                       <p className="text-gray-400 text-sm">Try adjusting your search or filter settings</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
      
//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
//           <div>
//             Showing <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{contacts.length}</span> contacts
//           </div>
//           <div className="flex items-center space-x-2">
//             <button    className={`px-3 py-1 border rounded-md disabled:opacity-50 
//                     ${previous ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300'}`}
//                   onClick={handlePrevious}
//                   disabled={!previous}>
//               Previous
//             </button>
//             <button  className={`px-3 py-1 border rounded-md
//                 ${next ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300'}`}
//               onClick={handleNext}
//               disabled={!next}>
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ContactView;

// ContactView.jsx - Final Clean Version
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
    console.log('Toggle favorite for:', id);
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