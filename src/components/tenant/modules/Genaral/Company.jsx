import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, Edit, Mail, Phone, MapPin, Globe, Calendar, 
  Upload, Users, DollarSign, Camera, Save, X, Briefcase, Hash
} from 'lucide-react';
import { fetchCompany, updateCompany } from '../../../../redux/slice/CompanyDetails';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../common/ToastNotification';

const Company = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState(null);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const fileInputRef = useRef(null);
  const { loading, error } = useSelector((state) => state.companyDetails);
  const { company, employee_count } = useSelector((state) => state.companyDetails.company);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.profile.id);
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const [companyDetails, setCompanyDetails] = useState({
    name: '', tagline: 'Software Development & Consulting', industry: 'Technology',
    email: '', phone: '', headquarters: 'San Francisco, CA', website: 'www.example.com',
    joined: 'N/A', founded: 'N/A', employees: '0', revenue: '$0',
    taxId: 'XX-XXXXXXX', businessType: 'Corporation',
  });
  
  // Update state when company data changes
  useEffect(() => {
    if (company) {
      setCompanyDetails({
        name: company.name || '',
        tagline: company.tagline || 'Software Development & Consulting',
        industry: company.industry || 'Technology',
        email: company.email || '',
        phone: company.contact || '',
        headquarters: company.headquarters || 'San Francisco, CA',
        website: company.website || 'www.example.com',
        joined: company.created_on || 'N/A',
        founded: company.founded || 'N/A',
        employees: employee_count?.toString() || '0',
        revenue: company.revenue || '$0',
        taxId: company.taxId || 'XX-XXXXXXX',
        businessType: company.businessType || 'Corporation',
      });
      if (company.logo) setLogo(company.logo);
    }
  }, [company, employee_count]);

  // Fetch company data on mount
  useEffect(() => {
    dispatch(fetchCompany(userId));
  }, [dispatch, userId]);

  const handleInputChange = (field, value) => {
    setCompanyDetails({...companyDetails, [field]: value});
  };

  const handleLogoChange = (e) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
        setShowUploadOption(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveChanges = async() => {
    // Validate required fields
    if (!companyDetails.name?.trim()) return showWarning('Please enter company name');
    if (!companyDetails.email?.trim()) return showWarning('Please enter company email');

    try {
      showInfo('Saving company information...');
      const resultAction = await dispatch(updateCompany({
        userId: userId,
        data: {
          ...companyDetails,
          contact: companyDetails.phone,
        }
      }));
      
      
      if (updateCompany.fulfilled.match(resultAction)) {
        showSuccess('Company information updated successfully!');
        setIsEditing(false);
        setShowUploadOption(false);
        dispatch(fetchCompany(userId)); // Refresh data
      } else {
        showError('Failed to update company information');
      }
    } catch (err) {
      showError('An error occurred while saving changes');
    }
  };

  const cancelChanges = () => {
    // Reset to current company data
    if (company) {
      setCompanyDetails({
        name: company.name || '',
        tagline: company.tagline || 'Software Development & Consulting',
        industry: company.industry || 'Technology',
        email: company.email || '',
        phone: company.contact || '',
        headquarters: company.headquarters || 'San Francisco, CA',
        website: company.website || 'www.example.com',
        joined: company.created_on || 'N/A',
        founded: company.founded || 'N/A',
        employees: employee_count?.toString() || '0',
        revenue: company.revenue || '$0',
        taxId: company.taxId || 'XX-XXXXXXX',
        businessType: company.businessType || 'Corporation',
      });
      company.logo ? setLogo(company.logo) : setLogo(null);
    }
    setIsEditing(false);
    setShowUploadOption(false);
    showInfo('Changes discarded');
  };

  const renderDetailRow = (icon, label, field, type = "text", is_edited = true) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0">
      <div className="pt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {isEditing && is_edited ? (
          <input
            type={type}
            value={companyDetails[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        ) : (
          <p className="text-sm font-medium text-gray-800 mt-1">{companyDetails[field]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {loading && <div className="w-full p-4 bg-blue-50 text-blue-700 rounded-md text-center">Loading...</div>}
      
      
      
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        {/* Company Header */}
        <div className='relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-6'>
            {/* Logo Section */}
            <div className="relative">
              <div 
                className={`w-24 h-24 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}
                onClick={isEditing ? () => setShowUploadOption(!showUploadOption) : undefined}
              >
                {logo ? (
                  <img src={logo} alt="Company logo" className="w-full h-full object-cover" />
                ) : (
                  <Building className='w-12 h-12 text-blue-500' />
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              {/* Upload Option Popup */}
              {showUploadOption && isEditing && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-10 w-48">
                  <button onClick={() => fileInputRef.current.click()} className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition">
                    <Upload className="w-4 h-4" />
                    <span>Upload new logo</span>
                  </button>
                  {logo && (
                    <button onClick={() => {setLogo(null); setShowUploadOption(false);}} 
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
                      <X className="w-4 h-4" />
                      <span>Remove logo</span>
                    </button>
                  )}
                </div>
              )}
              
              <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
            </div>
            
            {/* Company Details */}
            <div className='flex-1'>
              <div className='flex items-start sm:items-center justify-between'>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full text-xl font-bold text-gray-800 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  ) : (
                    <h2 className='text-xl font-bold text-gray-800'>{companyDetails.name}</h2>
                  )}
                  
                  <div className='flex items-center space-x-2 mt-2'>
                    {isEditing ? (
                      <input
                        type="text"
                        value={companyDetails.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        className="w-full text-sm text-gray-600 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    ) : (
                      <p className='text-sm text-gray-600'>{companyDetails.tagline}</p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full ${isEditing ? 'bg-blue-50' : ''}`}
                >
                  <Edit className='w-5 h-5' />
                </button>
              </div>
              
              <div className='flex flex-wrap items-center gap-2 mt-3'>
                {isEditing ? (
                  <div className="flex items-center border border-blue-300 rounded-md overflow-hidden">
                    <input
                      type="text"
                      value={companyDetails.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-24 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="Industry"
                    />
                  </div>
                ) : (
                  <span className='px-3 py-1 text-blue-600 border border-blue-200 bg-blue-50 text-xs font-semibold rounded-full whitespace-nowrap'>
                    {companyDetails.industry}
                  </span>
                )}
                
                <div className='flex items-center space-x-2'>
                  <Globe className='h-4 w-4 text-gray-500' />
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyDetails.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full text-xs text-gray-700 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  ) : (
                    <p className='text-xs text-gray-700'>{companyDetails.website}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className='p-6 bg-white'>
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className='text-md font-semibold text-gray-800'>Company Details</h3>
            <div className="text-xs text-gray-500">{isEditing ? "Edit Mode" : "View Mode"}</div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8'>
            <div>
              {renderDetailRow(<Building className='w-5 h-5 text-blue-500' />, 'Company Name', 'name')}
              {renderDetailRow(<Mail className='w-5 h-5 text-green-500' />, 'Email Address', 'email', 'email')}
              {renderDetailRow(<Phone className='w-5 h-5 text-purple-500' />, 'Phone Number', 'phone', 'tel')}
              {renderDetailRow(<MapPin className='w-5 h-5 text-red-500' />, 'Headquarters', 'headquarters')}
              {renderDetailRow(<Globe className='w-5 h-5 text-yellow-500' />, 'Website', 'website', 'url')}
            </div>
            
            <div>
              {renderDetailRow(<Calendar className='w-5 h-5 text-indigo-500' />, 'Founded', 'founded')}
              {renderDetailRow(<Calendar className='w-5 h-5 text-indigo-500' />, 'Joined', 'joined', "text", false)}
              {renderDetailRow(<Users className='w-5 h-5 text-teal-500' />, 'Employees', 'employees', 'text', false)}
              {renderDetailRow(<DollarSign className='w-5 h-5 text-emerald-500' />, 'Annual Revenue', 'revenue')}
              {renderDetailRow(<Hash className='w-5 h-5 text-orange-500' />, 'Tax ID', 'taxId')}
              {renderDetailRow(<Briefcase className='w-5 h-5 text-sky-500' />, 'Business Type', 'businessType')}
            </div>
          </div>
        </div>

        
        {isEditing && (
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3'>
            <button 
              onClick={cancelChanges}
              className='px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center gap-2'
              disabled={loading}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button 
              onClick={saveChanges}
              className='px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition flex items-center gap-2'
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;