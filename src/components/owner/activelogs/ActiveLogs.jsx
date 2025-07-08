import { useState, useEffect } from "react";
import { 
  Activity, 
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";
import Layout from "../dashboard/Layout";
import { getlogs } from "./api/LogsApi";


const ActiveLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

const fetchLogs = async () => {
    setLoading(true); 
    try {
      const response = await getlogs();
      setLogs(response.logs);
      
      
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLogs();
  }, []);


  const filteredLogs = logs?.filter(log => {
    const matchesSearch = log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === "all" || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Logs</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor real-time system activities</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchLogs}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold text-gray-800">System Activity</h2>
              <span className="ml-auto text-sm text-gray-500">
                {filteredLogs.length} logs found
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <div>
                        <h3 className="font-medium text-gray-900">{log.action}</h3>
                        <p className="text-sm text-gray-600">{log.name}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                      <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No logs found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActiveLogs;