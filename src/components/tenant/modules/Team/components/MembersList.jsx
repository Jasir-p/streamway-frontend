import { Plus } from 'lucide-react';

const MembersList = ({ members, onAddMember, onRemoveMember }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return 'bg-green-100 text-green-800';
      case false:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <button 
        className="flex text-sm items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full justify-center" 
        onClick={onAddMember}
      >
        <Plus className="w-5 h-5" />
        <span>Add Member</span>
      </button>

      <ul className="mt-4 space-y-4">
        {members?.length > 0 ? (
          members.map((member) => (
            <li key={member.id} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-full w-full object-cover rounded-full" 
                  />
                ) : (
                  <span>{member.name ? member.name.split(' ').map(n => n[0]).join('') : 'U'}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{member.role?.name || 'No position'}</p>
                <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(member.is_active)}`}>
                  {member.is_active?'active':'inactive' || 'Unknown'}
                </span>
              </div>
              <button
                onClick={() => onRemoveMember(member.id)}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <li className="text-center py-4 text-gray-500">No members found</li>
        )}
      </ul>
    </div>
  );
};

export default MembersList;