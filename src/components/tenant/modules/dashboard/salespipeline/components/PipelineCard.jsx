import React from 'react';

import { AlertCircle, Clock, CheckCircle, XCircle, Handshake, FileText, Tag, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PipelineCard = ({ item, isDeals = false }) => {
  const navigate = useNavigate();
  const getStatusIcon = (statusOrStage) => {
  const icons = {

    "new": <AlertCircle className="w-4 h-4" />,
    "in progress": <Clock className="w-4 h-4" />,
    "won": <CheckCircle className="w-4 h-4" />,
    "lost": <XCircle className="w-4 h-4" />,


    "discovery": <AlertCircle className="w-4 h-4" />,
    "qualification": <Tag className="w-4 h-4" />,
    "proposal": <FileText className="w-4 h-4" />,
    "negotiation": <Handshake className="w-4 h-4" />,
    "closed_won": <CheckCircle className="w-4 h-4 text-green-600" />,
    "closed_lost": <XCircle className="w-4 h-4 text-red-600" />,
  };

  // Normalize to lowercase for consistency
  const key = statusOrStage.toLowerCase();
  return icons[key] || <Clock className="w-4 h-4" />;
};

  const getStageColor = (stage) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'follow_up': 'bg-purple-100 text-purple-800',
      
      'converted': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800',
      'discovery': 'bg-purple-100 text-purple-800',
      'proposal': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
          {isDeals ? (
            <p className="text-sm text-gray-600">{item.account_id.name}</p>
          ) : (
            <p className="text-sm text-gray-600">{item.email}</p>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        {isDeals ? (
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(item.amount)}
          </span>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">📍 {item.location}</span>
          </div>
        )}
<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStageColor(isDeals ? item.stage : item.status)}`}>
  {getStatusIcon(isDeals ? item.stage : item.status)}
  {(isDeals ? item.stage : item.status).replace(/_/g, ' ').toUpperCase()}
</span>


      </div>
      
      <div className="space-y-2">
        {isDeals ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Probability:</span>
              <span className="font-medium">{item.probability}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Close Date:</span>
              <span className="font-medium">{new Date(item.closeDate)?.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Owner:</span>
              <span className="font-medium">{item?.owner?.name}</span>
            </div>
          </>
        ) : (
          <div 
            onClick={() => navigate(`/dashboard/sale/leads/${item.lead_id}/`)}
            className="cursor-pointer hover:bg-gray-50 p-2 rounded"
          >  
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{item.phone_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Source:</span>
              <span className="font-medium">{item.source}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Assigned to:</span>
              <span className="font-medium">{item.employee ? item.employee?.name : "Not assigned"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineCard;