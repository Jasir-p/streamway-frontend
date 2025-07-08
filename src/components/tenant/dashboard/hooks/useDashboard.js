import { useState, useEffect } from 'react';
import { getDashBordContent } from '../api/Dashboard';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    leadCount: 0,
    dealCount: 0,
    upcomingMeetingsCount: 0,
    pendingTaskCount: 0,
    overdueTasks: [],
    recentLeads: [],
    recentDeals: [],
    upcomingMeetings: [],
    dueTodayTasks: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = useSelector((state) => state.profile.id);
  const role = useSelector((state) =>state.auth.role)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const data = await getDashBordContent(role==='owner'?null:userId);
        
        

        const today = dayjs().startOf('day');

        const newLeads = data.leads.filter(lead => lead.status.toLowerCase() !== 'converted');
        const activeDeals = data.deals.filter(deal => {
          const status = deal.stage.toLowerCase();
          return status !== 'closed won' && status !== 'closed lost';
        });
        const upcomingMeetings = data.meetings
          .filter(meeting => meeting.status.toLowerCase() === 'pending')
          .slice(0, 5);

        const pendingTasks = data.tasks.filter(task => {
        const dueDate = dayjs(task.duedate);
        return dueDate.isSame(today, 'day') && task.status.toLowerCase() !== 'completed';
      });

      const pendingTasksCount = data.tasks.filter(task => {
        return task.status.toLowerCase() !== 'completed';
      }).length;  // assuming you want count — not a filtered list

      const overdueTasks = data.tasks
        .filter(task => {
          const dueDate = dayjs(task.duedate);
          return dueDate.isBefore(today, 'day') && task.status.toLowerCase() !== 'completed';
        })
        .slice(0, 5);  // show only first 5 overdue


        const recentLeads = data.leads.slice(0, 5);
        const recentDeals = activeDeals.slice(0, 5);
        const dueTodayTasks = pendingTasks.slice(0, 5);

        setDashboardData({
          leadCount: newLeads.length,
          dealCount: activeDeals.length,
          upcomingMeetingsCount: upcomingMeetings.length,
          pendingTaskCount: pendingTasksCount.length,
          overdueTasks,
          recentLeads,
          recentDeals,
          upcomingMeetings,
          dueTodayTasks
        });

      } catch (err) {
        
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  return { dashboardData, isLoading, error };
};
