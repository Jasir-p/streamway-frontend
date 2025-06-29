import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFields } from "../../../../../redux/slice/LeadFormSlice";
import { useToast } from "../../../../common/ToastNotification";
import { addLeads } from "../../../../../redux/slice/leadsSlice";

const AddLeadModal = ({ isOpen, onClose,onChange }) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const userId = useSelector((state) =>state.profile.id)
  const role = useSelector((state) =>state.auth.role)

  const { formfields = [] } = useSelector((state) => state.fields.field);

  // Required lead form fields
  const leadFormFields = [
    { id: "name", field_name: "Full Name", field_type: "text", is_required: true },
    { id: "email", field_name: "Email Address", field_type: "email", is_required: true },
    { id: "phone_number", field_name: "Contact Number", field_type: "tel", is_required: true },
        {id:'source', field_name: 'Source', field_type: 'select', is_required: true,
       options: [
      { value: 'website', label: 'Website' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'google_ads', label: 'Google Ads' },
      { value: 'referral', label: 'Referral' },
      { value: 'other', label: 'Other' }
    ]
     },
    { id: "location", field_name: "Location", field_type: "text", is_required: true },
  ];

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchFields());
    }
  }, [dispatch, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const allFields = [...leadFormFields, ...formfields];

    allFields.forEach(field => {
      if (field.is_required && !formValues[field.id]) {
        errors[field.id] = `${field.field_name} is required`;
      }

      // Email validation
      if (field.id === 'email' && formValues.email && !/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Please enter a valid email address';
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data with proper field names
      const formData = {};
      
      Object.keys(formValues).forEach(key => {
        const leadField = leadFormFields.find(f => f.id === key);
        const customField = formfields.find(f => f.id.toString() === key);
        
        if (leadField) {
          formData[leadField.id] = formValues[key];
        } else if (customField) {
          formData[customField.field_name] = formValues[key];
        }
      });
      formData.employee = role !=='owner'?userId:null
      formData.granted_by = role !=='owner'?userId:null
      console.log(formData);
      

      dispatch(addLeads(formData))
      
      setFormValues({});
      setFormErrors({});
      showSuccess("Lead information submitted successfully!");
      onChange()
      onClose(); // Close modal after successful submission

    } catch (error) {
      showError("Failed to submit lead information");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormValues({});
    setFormErrors({});
    onClose();
  };

  const renderField = (field) => {
    const { id, field_name, field_type, is_required, options = [] } = field;
    const hasError = formErrors[id];

    const baseClasses = `w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

    switch (field_type) {
      case "select":
        return (
          <>
            <select
              id={id}
              name={id}
              value={formValues[id] || ""}
              onChange={handleChange}
              className={`${baseClasses} bg-white`}
              required={is_required}
            >
              <option value="">Select {field_name}</option>
              {options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
          </>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={id}
              name={id}
              checked={formValues[id] || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
              {field_name}
            </label>
            {hasError && <p className="ml-2 text-xs text-red-500">{hasError}</p>}
          </div>
        );

      case "textarea":
        return (
          <>
            <textarea
              id={id}
              name={id}
              value={formValues[id] || ""}
              onChange={handleChange}
              placeholder={`Enter ${field_name}`}
              rows={3}
              className={baseClasses}
              required={is_required}
            />
            {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
          </>
        );

      default:
        return (
          <>
            <input
              type={field_type}
              id={id}
              name={id}
              value={formValues[id] || ""}
              onChange={handleChange}
              placeholder={`Enter ${field_name}`}
              className={baseClasses}
              required={is_required}
            />
            {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
          </>
        );
    }
  };

  const renderFieldGroup = (title, fields) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.field_name}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Lead Information</h2>
                
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFieldGroup("Lead Form Fields", leadFormFields)}
              
              {formfields.length > 0 && renderFieldGroup("Custom Fields", formfields)}

              {/* Footer */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Submit Lead Information"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;