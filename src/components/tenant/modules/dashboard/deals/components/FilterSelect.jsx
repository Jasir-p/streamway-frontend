import React from 'react';
import { dealsUtils } from './../utils/dealsUtils';

export const FilterSelect = ({ value, onChange, options, placeholder,isEmployeeFilter }) => (
<select 
  value={value} 
  onChange={onChange} 
  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="">{placeholder}</option>

  {isEmployeeFilter ? (
    options.map((option, index) => (
      <option key={option.value || index} value={option.value}>
        {option.label}
      </option>
    ))
  ) : (
    options.map((option, index) => (
      <option key={option} value={option}>
        {dealsUtils.formatStage(option)}
      </option>
    ))
  )}
</select>

);