export const dealsUtils = {
  getStatusColor: (status) => ({
    "new": "bg-blue-100 text-blue-800",
    "in_progress": "bg-yellow-100 text-yellow-800", 
    "won": "bg-green-100 text-green-800",
    "lost": "bg-red-100 text-red-800"
  }[status] || "bg-gray-100 text-gray-800"),

  getStatusIcon: (status) => {
    const icons = {
      "new": "AlertCircle",
      "in_progress": "Clock",
      "won": "CheckCircle",
      "lost": "XCircle"
    };
    return icons[status] || "Clock";
  },

  getPriorityColor: (priority) => ({
    "high": "bg-red-100 text-red-800 border-red-200",
    "medium": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "low": "bg-green-100 text-green-800 border-green-200"
  }[priority] || "bg-gray-100 text-gray-800 border-gray-200"),

  formatAmount: (amount) => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 100000) return `₹${(numAmount / 100000).toFixed(1)}L`;
    if (numAmount >= 1000) return `₹${(numAmount / 1000).toFixed(0)}K`;
    return `₹${numAmount}`;
  },

 formatStatus: (status) => {
  if (!status) return '';
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
},

formatStage: (stage) => {
  if (!stage) return '';
  return stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
},

formatPriority: (priority) => {
  if (!priority) return '';
  return priority.charAt(0).toUpperCase() + priority.slice(1);
},

};