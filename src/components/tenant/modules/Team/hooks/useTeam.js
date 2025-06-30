import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTeamById } from '../api/teamapi';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../../Intreceptors/LeadsApi';

export const useTeam = () => {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const[tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { team_id } = useParams();
  const [employees, setEmployees] = useState([]);
let completeCount = 0;
let pendingCount = 0;
  
const role = useSelector((state) =>state.auth.role)
const userId = useSelector((state) =>state.profile.id)


  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await fetchTeamById(team_id);
      if (data?.team) {
        setTeam(data.team);
        setMembers(data.team.members || [])
        setTasks(data.team.tasks);
       
        
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

tasks.forEach(task => {
  if (task.status === "COMPLETED") {
    completeCount++;
  } else {
    pendingCount++;
  }
});
const totalCount = tasks.length;
const completionRatio = totalCount > 0 ? (completeCount / totalCount) * 100 : 0;
  
  useEffect(() => {
    if (team_id) fetchTeam();
  }, [team_id]);

    useEffect(() => {
      const fetchEmployees = async () => {
        const data = await getUser(role==="owner"?role:userId);
        if (data) {
          setEmployees(data);
        }
      };
  
      fetchEmployees();
    }, []);

  return { team, members, tasks,loading, fetchTeam, team_id,employees,completeCount,pendingCount,completionRatio };
};