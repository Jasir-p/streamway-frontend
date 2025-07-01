import { Edit } from 'lucide-react';

const TeamHeader = ({ team, onEditClick,canEdit }) => {
  return (
    <div className="p-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {team.name || 'Team Name'}
        </h1>
        <p className="text-sm text-gray-600">
          Updated on {team.updated_at ? new Date(team.updated_at).toLocaleDateString() : 'N/A'}
        </p>
      </div>
      {canEdit &&(<button
        onClick={onEditClick}
        className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Team</span>
      </button>)}
      
    </div>
  );
};

export default TeamHeader;