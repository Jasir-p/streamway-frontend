import { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { addEmail } from '../../../../../redux/slice/EmailSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../../../../common/ToastNotification';

export default function ComposeEmailModal({ isOpen, onClose, onSelectContact=null,contacts,isType=false }) {
  const [contact, setContact] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('');
  const dispatch = useDispatch();
  const userID = useSelector((state)=>state.profile.id)
  const role = useSelector((state)=>state.auth.role)
  const { showSuccess, showError } = useToast();


  useEffect(()=>{
    if (contacts?.email){
      setContact(contacts.email)
      setType(contacts.type)
    }
  },[contacts])

  
const handleSubmit = async(e) =>
  {
    e.preventDefault();
    
    const data = {
      email: contact,
      subject: subject,
      body: body,
     
    }
    if (type === 'lead') {
    data.to_lead = [contacts.lead_id];
  } else if (type === 'contact') {
    data.to_contacts = [contacts.id];
  } else if (type === 'account') {
    data.to_accounts = [contacts.id];
  }
  if (role !== 'owner') {
     data.sender_id= userID 
  }
    
     try {
        await dispatch(addEmail(data)).unwrap(); // unwrap resolves or throws error
        showSuccess("Email sent successfully!"); // or use toast
        onClose();
      } catch (error) {
        
        showError("Failed to send email. Please try again."); // or use toast
      }
  }
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Compose Email</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label className="w-20 text-gray-700">To:</label>
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  disabled={isType}
                  className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none py-1"
                  placeholder="Enter email address"
                  value={contact || ''}
                  onChange={(e) =>
                    setContact(e.target.value)
                  }
                />
                {!isType &&(
                    <button
                 type="button"
                  onClick={onSelectContact}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                
                >
                  Select Contact
                </button>
                )}
                
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="w-20 text-gray-700">Subject:</label>
              <input
                type="text"
                value ={subject}
                onChange={(e)=> setSubject(e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none py-1"
                placeholder="Email subject"
              />
            </div>
          </div>

          <textarea
          value ={body}
          onChange={(e)=>setBody(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your message here..."
          ></textarea>

          <div className="mt-6 flex justify-end">
            <button
              className="mr-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Send Email
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}