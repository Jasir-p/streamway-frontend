
import { useSelector, useDispatch } from 'react-redux';
 import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react';
import { addContact } from '../../../../redux/slice/contactSlice';
import { useToast } from '../../../common/ToastNotification';
import { fetchAccounts } from '../../../../redux/slice/AccountsSlice';

const ContactForm = ({ isOpen, onClose, onChange, contact = null, isEdit = false }) => {
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.profile.id);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const accounts = useSelector((state) => state.accounts.accounts);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    account_id: '',
    department: ''
  });

  useEffect(() => {
    dispatch(fetchAccounts());
    
    // If editing, populate form with existing contact data
    if (isEdit && contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone_number: contact.phone_number || '',
        account_id: contact.account_id || '',
        department: contact.department || ''
      });
    } else if (!isEdit) {
      // Reset form when not editing
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        account_id: '',
        department: ''
      });
    }
  }, [dispatch, isEdit, contact]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z ]{3,}$/.test(formData.name.trim())) {
      newErrors.name = 'Name must be at least 3 letters and contain only alphabets and spaces';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number.trim())) {
      newErrors.phone_number = 'Phone number must be exactly 10 digits';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    } else if (!/^[A-Za-z ]+$/.test(formData.department.trim())) {
      newErrors.department = 'Department must contain only letters';
    }
    
    if (!formData.account_id) {
      newErrors.account_id = 'Please select an account';
    }

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
  
        
        showSuccess('Contact saved successfully!');
  
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          address: '',
          account_id: '',
          department: ''
        });
        onChange();
        onClose();
      } catch (error) {
        
        showError('Failed to save contact. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Contact' : 'Add Contact'}</h2>

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
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone*
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.phone_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact number"
            />
            {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>}
          </div>

          <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department{!contact.is_primary_contact && '*'}
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  !contact.is_primary_contact && errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter Department"
              />
              {!contact.is_primary_contact && errors.department && (
                <p className="mt-1 text-sm text-red-500">{errors.department}</p>
              )}
            </div>


          <div>
            <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 mb-1">
              Select Account*
            </label>
            <select
              id="account_id"
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.account_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Choose an account --</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.account_id && <p className="mt-1 text-sm text-red-500">{errors.account_id}</p>}
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
              {isEdit ? 'Update Contact' : 'Save Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;