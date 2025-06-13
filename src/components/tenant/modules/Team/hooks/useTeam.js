import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTeamById } from '../api/teamApi';

export const useTeam = () => {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { team_id } = useParams();

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await fetchTeamById(team_id);
      if (data?.team) {
        setTeam(data.team);
        setMembers(data.team.members || []);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (team_id) fetchTeam();
  }, [team_id]);

  return { team, members, loading, fetchTeam, team_id };
};