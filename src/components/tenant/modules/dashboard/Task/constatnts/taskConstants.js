export const INITIAL_FORM_DATA = {
  title: '', description: '', priority: 'MEDIUM', dueDate: '', assignTo: 'individual',
  assigned_to_employee: '', assigned_to_team: null, lead: null, contact: null,
  account: null, status: 'TODO', subtasks: [], attachment: [], tags: []
};

export const OPTIONS = {
  priority: [
    { value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' }, { value: 'URGENT', label: 'Urgent' }
  ],
  status: [
    { value: 'TODO', label: 'To Do' }, { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Under Review' }, { value: 'COMPLETED', label: 'Completed' },
    { value: 'BLOCKED', label: 'Blocked' }
  ],
};
