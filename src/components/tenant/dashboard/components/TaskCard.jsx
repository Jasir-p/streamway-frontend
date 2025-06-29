export const TaskCard = ({ title, tasks, isOverdue = false }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 className={`text-lg font-semibold mb-4 ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
      {title} ({tasks.length})
    </h3>

    {tasks.length === 0 ? (
      <div className="text-sm text-gray-500 text-center py-8">
        No tasks to show.
      </div>
    ) : (
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{task.title}</p>
              <p className="text-xs text-gray-600">
                Assigned to: {task.assigned_to_employee?.name}
                {task.assigned_to_employee?.role?.name ? ` (${task.assigned_to_employee.role.name})` : ''}
              </p>
            </div>
            <div className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'} whitespace-nowrap ml-2`}>
              {task.duedate}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
