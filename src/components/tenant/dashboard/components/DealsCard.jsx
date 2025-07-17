export const DealsCard = ({ deals }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Deals</h3>
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {deals.length > 0 ? (
        deals.map((deal, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-gray-800 text-sm">{deal.title}</h4>
              <span className="text-sm font-bold text-green-600">₹{deal.amount.toLocaleString()}</span>
            </div>

            <div className="text-xs text-gray-500 mb-2">Deal ID: #{deal.deal_id}</div>

            <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
              <span>Stage: <span className="font-medium">{deal.stage}</span></span>
              <span>Rep: <span className="font-medium">{deal?.owner?.name}</span></span>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Close Date:</span>
                <span>{deal.expected_close_date}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-gray-500 py-8  rounded-lg">
          No active deals found.
        </div>
      )}
    </div>
  </div>
);
