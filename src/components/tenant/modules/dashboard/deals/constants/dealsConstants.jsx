export const FILTER_OPTIONS = {
  stage: ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"],
  status: ["new", "in_progress", "won", "lost"],
  priority: ["high", "medium", "low"],
  source: [],
  assignedTo: [],
  dateRange: ["This Week", "This Month", "Last 30 Days", "Last 90 Days"],
  amountRange: ["< ₹50K", "₹50K - ₹1L", "₹1L - ₹5L", "> ₹5L"]
};

export const TABLE_HEADERS = [
  'Deal', 'Account', 'Stage',  'Amount', 'Close Date', 'Assigned To', 'Actions'
];