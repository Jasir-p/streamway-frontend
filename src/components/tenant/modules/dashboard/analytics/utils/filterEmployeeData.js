


import { useSelector } from "react-redux";

export const mapEmployeeStats = (employeeData = []) => {
  return (Array.isArray(employeeData) ? employeeData : []).map((emp) => ({
    ...emp,
    name: emp.employee_name,
    role: emp.empolyee_role,

    ownLeads: emp.lead_stats?.own_leads || 0,
    subordinateLeads: emp.lead_stats?.subordinate_leads || 0,

    ownDeals: emp.deal_stats?.own_deals || 0,
    subordinateDeals: emp.deal_stats?.subordinate_deals || 0,
    convertedDeals: emp.deal_stats?.converted_deals || 0,
    totalRevenue: emp.deal_stats?.total_deal_value || 0,
    ownRevenue: emp.deal_stats?.own_value || 0,
    subordinateRevenue: emp.deal_stats?.subordinate_value || 0,

    ownMeetings: emp.meeting_stats?.own_meeting || 0,
    subordinateMeetings: emp.meeting_stats?.subordinate_meeting || 0,

    ownTasks: emp.task_stats?.own_task || 0,
    subordinateTasks: emp.task_stats?.subordinate_task || 0,

    ownAccounts: emp.account_stats?.own_account || 0,
    subordinateAccounts: emp.account_stats?.subordinate_account || 0,
  }));
};

export const mapteamStats = (teamData = []) => {
  return (Array.isArray(teamData) ? teamData : []).map((team) => ({
    ...team,
    name: team.team_name,
    totalTasks: team.team_stats?.total_task || 0,
    totalComplete:team.team_stats?.completed_task||0,
    totalPending: team.team_stats?.pending_task||0,
    totalDue : team.team_stats?.due_task||0,

  }));
};
