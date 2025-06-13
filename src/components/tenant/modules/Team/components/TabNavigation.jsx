import { FileText, Users, Activity } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'activities', label: 'Recent Activities', icon: Activity }
  ];

  return (
    <div className="flex space-x-4">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
            activeTab === id ? 'bg-gray-300' : 'bg-transparent'
          }`}
        >
          <Icon className="w-5 h-5 text-gray-600" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;