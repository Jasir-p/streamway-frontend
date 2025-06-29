export const StatCard = ({ icon, label, value, trend, trendColor = "text-green-500" }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`text-sm font-semibold ${trendColor}`}>
          +{trend}%
        </div>
      )}
    </div>
  </div>
);