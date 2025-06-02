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
  Inbox
} from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { fetchEmails } from '../../../../../redux/slice/EmailSlice';
import { useSelector, useDispatch } from 'react-redux';
import { EmailDetailModal } from './EmailDetail';
import ComposeEmailModal from './AddMail';
import ContactsModal from './ContactsModal';

export default function EmailManagementUI() {
  const [activeTab, setActiveTab] = useState('sent');
  const [emailDetailModal, setEmailDetailModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const { emails, loading } = useSelector((state) => state.emails);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmails());
  }, []);

  const emailCategories = [
    { id: 'all', name: 'All Emails', count: 256 },
    { id: 'follow_up', name: 'Follow-up', count: 42 },
    { id: 'aftersale', name: 'After Sale', count: 38 },
    { id: 'leads', name: 'Leads', count: 87 },
    { id: 'won', name: 'Won Deals', count: 24 },
  ];



  const filteredEmails = activeCategory === 'all'
    ? emails
    : emails.filter(email => email.category === activeCategory);

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
  const selected =(contact)=>{
    setShowContactsModal(false);
    setSelectedContact(contact);
    console.log(contact.type);
    

  }

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <button
              onClick={handleComposeEmail}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Send size={16} />
              <span>Compose</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-3 py-2">
              <ul>
                <li>
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'inbox' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Inbox size={18} className="mr-2" />
                    <span>Inbox</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'sent' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Send size={18} className="mr-2" />
                    <span>Sent</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('archive')}
                    className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'archive' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Archive size={18} className="mr-2" />
                    <span>Archived</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('trash')}
                    className={`flex items-center w-full px-3 py-2 rounded-md ${activeTab === 'trash' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Trash size={18} className="mr-2" />
                    <span>Trash</span>
                  </button>
                </li>
              </ul>
            </div>

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

              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center gap-1 text-gray-700 hover:bg-gray-100 rounded-md px-3 py-1.5">
                  <Filter size={16} />
                  <span>Filter</span>
                  <ChevronDown size={16} />
                </button>

                <button
                  onClick={() => setShowContactsModal(true)}
                  className="flex items-center justify-center gap-1 text-gray-700 hover:bg-gray-100 rounded-md px-3 py-1.5"
                >
                  <Users size={16} />
                  <span>Contacts</span>
                </button>
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Sent Emails</h2>
            </div>

            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Send size={48} />
                <p className="mt-2">No sent emails in this category</p>
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
                          <p className="text-sm font-medium text-gray-900">To: {email?.recipient?.name}</p>
                          <p className="text-xs text-gray-500">{email.created_At}</p>
                        </div>

                        <p className="text-sm font-medium text-gray-900">{email.subject}</p>

                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 truncate">{email.recipient?.email}</span>
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

                          {email.is_sent && (
                            <span className="ml-2 text-green-500 text-xs flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Delivered
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
          onSelectContact ={selected}
        />
      </div>
    </DashboardLayout>
  );
}