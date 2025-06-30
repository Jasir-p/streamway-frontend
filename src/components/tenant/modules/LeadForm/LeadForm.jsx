import React, { useState, useEffect } from 'react';
import SettingsLayout from '../../settings/Settings';
import PreviewForm from './Preview';
import { useSelector, useDispatch } from 'react-redux';
import { addField, fetchFields, deleteField,updateField } from '../../../../redux/slice/LeadFormSlice';
import { Pencil, Trash2 } from 'lucide-react';
import isEqual from 'lodash/isEqual';;
import { useToast } from '../../../common/ToastNotification';

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [formTitle, setFormTitle] = useState('Lead Generation Form');
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [changeTracker, setChangeTracker] = useState(false);
  const dispatch = useDispatch();
  const { field, loading, error } = useSelector((state) => state.fields);
  const [originaField, setOriginaField]=useState()
  const { showSuccess, showError, showWarning } = useToast();


  useEffect(() => {
    dispatch(fetchFields());
  }, [dispatch, changeTracker]);

  // Initial state for form configuration
  const [formConfig, setFormConfig] = useState({
    field: field?.formfields || [],
    formStyle: {
      containerClass: ''
    },
    buttonStyle: {
      text: 'Submit',
      class: ''
    }
  });


  useEffect(() => {
    if (field?.formfields) {
      setFormConfig((prevConfig) => ({
        ...prevConfig,
        field: field.formfields
      }));
    }
  }, [field]);


  const availableFieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email Input' },
    { value: 'tel', label: 'Phone Input' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'date', label: 'Date Picker' },
    { value: 'checkbox', label: 'Checkbox' }
  ];


  const [newField, setNewField] = useState({
    field_name: '',
    field_type: 'text',
    is_required: false,
    options: [{ value: 'option1', label: 'Option 1' }]
  });

  const handleAddField = async () => {
    if (!newField.field_name) return;

    const updatedOptions = newField.field_type === 'select' ? newField.options : [];

    try {
      if (editingFieldId) {
        if(isEqual(newField,originaField)){
          showWarning("NO changes made.")
          return

        }

        await dispatch(updateField({
          field_id: editingFieldId,
          field_name: newField.field_name,
          field_type: newField.field_type,
          is_required: newField.is_required,
          options: updatedOptions
        })).unwrap();
        setEditingFieldId(null);
      } else {
        // Add new field
        await dispatch(addField({
          field_name: newField.field_name,
          field_type: newField.field_type,
          is_required: newField.is_required,
          options: updatedOptions
        })).unwrap();
      }
      
      

      setChangeTracker(true);


      setNewField({
        field_name: '',
        field_type: 'text',
        is_required: false,
        options: [{ value: 'option1', label: 'Option 1' }]
      });
    } catch (error) {
      console.error("Field operation failed:", error);
    }
  };

  const handleEditField = (fieldToEdit) => {
    setEditingFieldId(fieldToEdit.id);
    setNewField({
      field_name: fieldToEdit.field_name,
      field_type: fieldToEdit.field_type,
      is_required: fieldToEdit.is_required,
      options: fieldToEdit.options || [{ value: 'option1', label: 'Option 1' }]
    });
    setOriginaField({
      field_name: fieldToEdit.field_name,
      field_type: fieldToEdit.field_type,
      is_required: fieldToEdit.is_required,
      options: fieldToEdit.options || [{ value: 'option1', label: 'Option 1' }]
    })
    
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await dispatch(deleteField(fieldId)).unwrap();
        setChangeTracker(prev => !prev);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
    setNewField({
      field_name: '',
      field_type: 'text',
      is_required: false,
      options: [{ value: 'option1', label: 'Option 1' }]
    });
  };


  const handleAddOption = () => {
    const updatedOptions = [
      ...newField.options,
      { value: `option${newField.options.length + 1}`, label: `Option ${newField.options.length + 1}` }
    ];

    setNewField({
      ...newField,
      options: updatedOptions
    });
  };


  const handleUpdateOption = (index, key, value) => {
    const updatedOptions = [...newField.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [key]: value
    };

    setNewField({
      ...newField,
      options: updatedOptions
    });
  };


  const handleRemoveOption = (index) => {
    setNewField({
      ...newField,
      options: newField.options.filter((_, i) => i !== index)
    });
  };


  const handleButtonTextChange = (text) => {
    setFormConfig({
      ...formConfig,
      buttonStyle: {
        ...formConfig.buttonStyle,
        text
      }
    });
  };

  return (
    <SettingsLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Form Builder</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'builder' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('builder')}
          >
            Builder
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        {activeTab === 'builder' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Form builder options */}
            <div className="space-y-6">
              {/* Form title */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-medium mb-3">Form Settings</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
                    <input
                      type="text"
                      value={formConfig.buttonStyle.text || 'Submit'}
                      onChange={(e) => handleButtonTextChange(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Field list with edit/delete options */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-medium mb-3">Custom Form Fields</h2>
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading fields...</p>
                ) : error ? (
                  <p className="text-red-500 text-sm">Error loading fields: {error}</p>
                ) : formConfig.field && formConfig.field.length > 0 ? (
                  <div className="space-y-3">
                    {formConfig.field.map((fieldItem) => (
                      <div key={fieldItem.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                        <div>
                          <span className="font-medium">{fieldItem.field_name}</span>
                          <span className="ml-2 text-sm text-gray-500">({fieldItem.field_type})</span>
                          {fieldItem.is_required && <span className="ml-2 text-xs text-red-500">*Required</span>}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditField(fieldItem)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"
                            aria-label="Edit field"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteField(fieldItem.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                            aria-label="Delete field"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No custom fields added yet.</p>
                )}
              </div>

              {/* New field form */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-medium mb-3">
                  {editingFieldId ? 'Edit Field' : 'Add New Field'}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
                    <input
                      type="text"
                      value={newField.field_name}
                      onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Job Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                    <select
                      value={newField.field_type}
                      onChange={(e) => setNewField({ ...newField, field_type: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableFieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="required-field"
                      checked={newField.is_required}
                      onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="required-field" className="ml-2 text-sm text-gray-700">
                      Required Field
                    </label>
                  </div>

                  {/* Options for select/dropdown fields */}
                  {newField.field_type === 'select' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Options</label>

                      {newField.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                            placeholder="Option label"
                            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                            placeholder="Option value"
                            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="text-red-500 hover:bg-red-100 p-1 rounded-md"
                            aria-label="Remove option"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-blue-500 text-sm"
                      >
                        Add Option
                      </button>
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      {editingFieldId ? 'Update Field' : 'Add Field'}
                    </button>

                    {editingFieldId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Form preview */}
            <PreviewForm formTitle={formTitle} formConfig={formConfig} isPreview={true} />
          </div>
        ) : (
          <PreviewForm formTitle={formTitle} formConfig={formConfig} isPreview={true} />
        )}
      </div>
    </SettingsLayout>
  );
};

export default FormBuilder;