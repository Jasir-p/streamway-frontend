export const UpcomingMeetings = ({ meetings }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h3>

    {meetings.length === 0 ? (
      <div className="text-sm text-gray-500 text-center py-8">
        No upcoming meetings scheduled.
      </div>
    ) : (
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {meetings.map(meeting => (
          <div
            key={meeting.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 text-sm">{meeting.contact?.name}</h4>

              <p className="text-xs text-gray-600">
                {meeting.contact?.email} | {meeting.contact?.phone_number}
              </p>

              <p className="text-xs text-gray-600 font-semibold mt-1">{meeting.title}</p>
              {meeting.notes && (
                <p className="text-xs text-gray-500 italic mt-0.5">Notes: {meeting.notes}</p>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Rep: {meeting.host?.name}
                {meeting.host?.role?.name && (
                  <span className="ml-1 text-gray-400">({meeting.host.role.name})</span>
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium text-gray-800 text-sm">{meeting.start_time}</p>
              <p className="text-xs text-gray-600">{meeting.time}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
