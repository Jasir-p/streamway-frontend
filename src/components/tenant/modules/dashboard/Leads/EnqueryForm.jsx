import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFields } from "../../../../../redux/slice/LeadFormSlice";
import subdomainInterceptors from "../../../../../Intreceptors/getSubdomainInterceptors";
import { useToast } from "../../../../common/ToastNotification";

const addEnquiry = async (data, showSuccess, showError) => {
  try {
    const response = await subdomainInterceptors.post("/api/webenquiry/", data);
    showSuccess(response.data.message); 
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.detail || error?.message || "Something went wrong";
    showError(errorMessage); 
    console.error("API Error:", error?.response?.data || error.message);
    throw error; 
  }
};

  

const EnquiryForm = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { showSuccess, showError, showWarning } = useToast();



  useEffect(() => {
    dispatch(fetchFields());
  }, [dispatch]);


  const { formfields = [] } = useSelector((state) => state.fields.field);
  console.log(formfields)

  const requiredFields = [
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
    ]},
    { id: "location", field_name: "Location", field_type: "text", is_required: true },
      
  ];


  const contactFields = requiredFields.slice(0, 4);
  const locationFields = [requiredFields[4]];
  const additionalFields = formfields;


  const [formValues, setFormValues] = useState({});


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    

    if (formErrors[name]) {
      setFormErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validateForm = () => {
    const errors = {};
    const allFields = [...requiredFields, ...formfields];
    
    allFields.forEach(field => {
      if (field.is_required && !formValues[field.id]) {
        errors[field.id] = `${field.field_name} is required`;
      }
      
      if (field.id === 'email' && formValues.email && !/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Email address is invalid';
      }
    });
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const allFields = [...requiredFields, ...formfields];
      const readableFormData = {};
  
      Object.keys(formValues).forEach((key) => {
        let field = requiredFields.find(f => f.id.toString() === key);
        let label = key;

        if (field) {
            
            label = field.field_name;
            readableFormData[field.id] = formValues[key];
        } else {
    
            field = formfields.find(f => f.id.toString() === key);
            label = field ? field.field_name : key;
            readableFormData[label] = formValues[key]; 
        }
            });
      
      console.log("Submitted Data:", readableFormData);
  

      const response = await addEnquiry(readableFormData,showSuccess,showError);
      console.log("Server response:", response);
  
      setSubmitSuccess(true);
  
      setTimeout(() => {
        setFormValues({});
        setSubmitSuccess(false);
      }, 5000);
  
    } catch (error) {
      showError(error.message)
      
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const renderField = (field) => {
    const { id, field_name, field_type, is_required, options = [] } = field;
    const hasError = formErrors[id];

    if (field_type === "select") {
      return (
        <>
          <select
            id={id}
            name={id}
            value={formValues[id] || ""}
            onChange={handleChange}
            className={`w-full rounded-md border ${hasError ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            required={is_required}
          >
            <option value="">Select {field_name}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
        </>
      );
    }
    
    if (field_type === "checkbox") {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={id}
            name={id}
            checked={formValues[id] || false}
            onChange={handleChange}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${hasError ? "border-red-500" : ""}`}
          />
          <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
            {field_name}
          </label>
          {hasError && <p className="ml-2 text-xs text-red-500">{hasError}</p>}
        </div>
      );
    }

    if (field_type === "textarea") {
      return (
        <>
          <textarea
            id={id}
            name={id}
            value={formValues[id] || ""}
            onChange={handleChange}
            placeholder={`Enter ${field_name}`}
            rows={3}
            className={`w-full rounded-md border ${hasError ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required={is_required}
          />
          {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
        </>
      );
    }

    return (
      <>
        <input
          type={field_type}
          id={id}
          name={id}
          value={formValues[id] || ""}
          onChange={handleChange}
          placeholder={`Enter ${field_name}`}
          className={`w-full rounded-md border ${hasError ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required={is_required}
        />
        {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
      </>
    );
  };

  // Render a field group with title
  const renderFieldGroup = (title, fields) => {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
          {title}
        </h3>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="mb-4">
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
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Lead Information</h2>
        <p className="text-sm text-gray-500 mt-1">Please fill out the information below to register your interest</p>
      </div>
      
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Submission successful</h3>
              <p className="text-sm text-green-700 mt-1">
                Thank you for your interest. One of our representatives will contact you shortly.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFieldGroup("Contact Information", contactFields)}
          {renderFieldGroup("Location Details", locationFields)}
          {additionalFields.length > 0 && renderFieldGroup("Additional Information", additionalFields)}
          
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Lead Information"
              )}
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              By submitting this form, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default EnquiryForm;