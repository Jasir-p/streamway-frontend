import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { addContact } from '../../../../redux/slice/contactSlice';
import { useToast } from '../../../common/ToastNotification';
import { fetchAccounts } from '../../../../redux/slice/AccountsSlice';



const ContactForm = ({ isOpen, onClose,onChange }) => {
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.profile.id);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  // const [selectedAccount, setSelectedAccount] = useState('')
  const accounts = useSelector((state) => state.accounts.accounts);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    account_id:'',
    department:''
  });

  useEffect (()=>{
    dispatch(fetchAccounts())

  },[])

  const [errors, setErrors] = useState({});


  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await dispatch(addContact(formData)).unwrap();
  
        console.log('Contact Form Submitted:', response);
        showSuccess('Contact saved successfully!');
  
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          account_id:null,
          department:''
        });
        onChange()
        onClose();
      } catch (error) {
        console.error('Error saving contact:', error);
        showError('Failed to save contact. Please try again.');
      }
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Add Contact</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter contact number"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="name"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

        <div className="p-4">
            <label className="block text-sm font-medium mb-1">Select Account</label>
            <select
            name='account_id'
              value={formData.account_id}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="">-- Choose an account --</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
        </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
