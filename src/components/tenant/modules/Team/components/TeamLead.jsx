const TeamLead = ({ teamLead, onChangeTeamLead }) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800">Team Lead</h3>
      {teamLead ? (
        <div className="flex items-center space-x-3 mt-2">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {teamLead.avatar ? (
              <img 
                src={teamLead.avatar} 
                alt={teamLead.name} 
                className="h-full w-full object-cover rounded-full" 
              />
            ) : (
              <span className="text-lg font-semibold">
                {teamLead.name ? teamLead.name.split(' ').map(n => n[0]).join('') : 'TL'}
              </span>
            )}
          </div>
          <div>
            <p className="text-md font-medium text-gray-900">{teamLead.name || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{teamLead.role?.name || 'No role'}</p>
            <p className="text-sm text-gray-500">{teamLead.email || 'No email'}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No team lead assigned</p>
      )}
      <button
        onClick={onChangeTeamLead}
        className="mt-3 text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Change Team Lead
      </button>
    </div>
  );
};

export default TeamLead;