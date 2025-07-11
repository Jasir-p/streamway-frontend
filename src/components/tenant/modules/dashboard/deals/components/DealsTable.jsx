import React from 'react';
import { Calendar, Building2, User, Eye, Edit3, Trash2, AlertCircle, Clock, CheckCircle, XCircle,HandshakeIcon,FileText,Tag } from 'lucide-react';
import { dealsUtils } from './../utils/dealsUtils';
import { TABLE_HEADERS } from './../constants/dealsConstants';
import { ActionButton } from './ActionButton';
import { useNavigate } from 'react-router-dom';

export const DealsTable = ({ 
  deals, 
  selectedDeals, 
  onToggleSelection, 
  onSelectAll,
  onView,
  onEdit,
  onDelete
}) => {
    const navigate = useNavigate();
    const subdomain = localStorage.getItem("subdomain")
   const getStatusIcon = (status) => {
    const icons = {
    "discovery": <AlertCircle className="w-4 h-4" />,
    "qualification": <Tag className="w-4 h-4" />,
    "proposal": <FileText className="w-4 h-4" />,
    "negotiation": <HandshakeIcon className="w-4 h-4" />,
    "closed_won": <CheckCircle className="w-4 h-4 text-green-600" />,
    "closed_lost": <XCircle className="w-4 h-4 text-red-600" />,
    };
    // Add null/undefined check
    if (!status) return <Clock className="w-4 h-4" />;
    const key = status.toLowerCase();
    return icons[key] || <Clock className="w-4 h-4" />;
  };
  const handleActionClick = (e, action, dealId) => {
    e.stopPropagation(); // Prevent row click when clicking action buttons
    action(dealId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  checked={selectedDeals.length === deals.length && deals.length > 0} 
                  onChange={onSelectAll} 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
              </th>
              {TABLE_HEADERS.map(header => (
                <th 
                  key={header} 
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${
                    header === 'Actions' ? 'text-center' : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deals.map((deal) => (
              <tr key={deal.deal_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedDeals.includes(deal.deal_id)} 
                    onChange={() => onToggleSelection(deal.deal_id)} 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                </td>
                
                {/* Deal Column */}
                <td className="px-4 py-4" onClick={()=>navigate(`/${subdomain}/dashboard/sale/deals/${deal.deal_id}/`)}>
                  <div className="font-medium text-gray-900">{deal.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${dealsUtils.getPriorityColor(deal.priority)}`}>
                      {dealsUtils.formatPriority(deal.priority || 'medium')}
                    </span>
                    <span className="text-xs text-gray-500">ID: {deal.deal_id}</span>
                  </div>
                </td>
                
                {/* Account Column */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {deal.account_id?.name || 'No Account'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {deal.account_id?.account_type || ''}
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Stage Column */}
                {/* <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">
                    {dealsUtils.formatStage(deal.stage || 'discovery')}
                  </span>
                </td> */}
                
                {/* Status Column */}
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${dealsUtils.getStatusColor(deal.stage)}`}>
                    {getStatusIcon(deal.stage || 'discovery')}
                    {dealsUtils.formatStatus(deal.stage)}
                  </span>
                </td>
                
                {/* Amount Column */}
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {dealsUtils.formatAmount(deal.amount)}
                  </span>
                </td>
                
                {/* Close Date Column */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(deal.expected_close_date).toLocaleDateString()}
                  </div>
                </td>
                
                {/* Assigned To Column */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {deal.owner?.name 
                        ? `${deal.owner?.name}(${deal.owner?.role?.name || 'User'})` 
                        : 'Owner'
                      }
                    </span>
                  </div>
                </td>
                
                {/* Actions Column */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <ActionButton 
                      icon={Eye} 
                      color="blue" 
                      onClick={() => onView && onView(deal.deal_id)}
                    />
                    <ActionButton 
                      icon={Edit3} 
                      color="green" 
                       onClick={(e) => handleActionClick(e, onEdit, deal.deal_id)}
                    />
                    <ActionButton 
                      icon={Trash2} 
                      color="red" 
                      onClick={() => onDelete && onDelete(deal.deal_id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};