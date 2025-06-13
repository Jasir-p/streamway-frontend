const TabContent = ({ activeTab, team, members, activities, onChangeTeamLead, onRemoveMember }) => {
  if (activeTab === 'overview') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
        <p className="mt-4 text-gray-600">
          This is an overview of your team's performance, tasks, and achievements.
        </p>
        {team.description && (
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-800">Team Description</h4>
            <p className="mt-2 text-gray-600">{team.description}</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'members') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
        {/* Team Lead and Members content */}
      </div>
    );
  }

  if (activeTab === 'activities') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
        <ul className="mt-4 space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center space-x-3">
              {/* Activity content */}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default TabContent;