const TeamStats = ({ team }) => {
  const defaultStats = {
    completion_rate: 0,
    tasks_completed: 0,
    tasks_pending: 0
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
          <p className="text-sm text-gray-600">
            Completion Rate: {team.completion_rate || defaultStats.completion_rate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {team.tasks_completed || defaultStats.tasks_completed}
          </p>
          <p className="text-sm text-gray-500">Tasks Completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {team.tasks_pending || defaultStats.tasks_pending}
          </p>
          <p className="text-sm text-gray-500">Tasks Pending</p>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;