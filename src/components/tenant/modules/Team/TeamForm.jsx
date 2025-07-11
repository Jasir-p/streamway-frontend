import React, { useEffect,useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../../redux/slice/UsersSlice";
import { useForm } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import { getUser } from '../../../../Intreceptors/LeadsApi';
import { useTeam } from './hooks/useTeam';


const TeamForm = ({isOpen, onClose,changes, onSubmit,team=null, type='add'}) => {

const checkMade = (data)=>{
  const selectedFieldsFromTeam = {
    name: team?.name,
    team_lead: String(team?.team_lead?.id),
    description:team?.description,
  };
  
  if(isEqual(data,selectedFieldsFromTeam)){
            
        return}
  onSubmit(data)}



const { register, handleSubmit, reset, formState: { errors } } = useForm();
const {employees}=useTeam()


      return (
     isOpen && (<div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">

      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Add Team</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit((data) => {
                
                checkMade(data);
                reset();
              })} className="mt-4 space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700">Team Name</label>
          <input
            id="teamName"
            defaultValue={team?.name}
            {...register("name", { required: "Team Name is required" })}
            className="w-full border border-gray-300 rounded-2xl px-3 py-2 mt-1 focus:border-blue-300 focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter team name"
          />
          {errors.teamName && <div className="text-red-500 text-sm">{errors.teamName.message}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Team Description</label>
          <textarea
            id="description"
            defaultValue={team?.description}
            {...register("description")}
            className="w-full border border-gray-300 rounded-2xl px-3 py-2 mt-1 focus:border-blue-300 focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter team description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Team Leader</label>
          <select
            {...register("team_lead", { required: "Team Leader is required" })}
            className="w-full border border-gray-300 rounded-2xl px-3 py-2 mt-1 focus:border-blue-300 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            <option value={team?.team_lead.id}>{team?.team_lead.name ||"Select a team leader"}{team?.team_lead?.role?.name ? ` (${team.team_lead.role.name})` : ""}</option>
            {employees.map((user) => (
              <option key={user.id} value={user.id}>
              {user.name} ({user.role?.name || "No Role"})
            </option>
            ))}
          </select>
          {errors.teamLeader && <div className="text-red-500 text-sm">{errors.teamLeader.message}</div>}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={() => {
                    onClose();
                    reset();
                  }} className="px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {type==='add'?'Add Team':"Update"}
          </button>
        </div>
      </form>
    </div>
  </div>
     )
);

 
}

export default TeamForm
