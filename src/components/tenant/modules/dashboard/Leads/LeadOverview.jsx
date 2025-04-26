import React, { useEffect, useState } from 'react';
import { Clock, Mail, Phone, Globe, FileText, ChevronRight, Edit, Trash, Check, Calendar, DollarSign, Users } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useParams } from 'react-router-dom';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';
import { editLead } from '../../../../../redux/slice/leadsSlice';
import { useDispatch } from 'react-redux';

const fetchLeadById = async (lead_id) => {
    try {
        const response = await subdomainInterceptors.get("api/lead-overview/",
            {params:{lead_id}}
        )
        console.log(response.data)
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}
    

export default function LeadDetailPage() {
  const [activeTab, setActiveTab] = useState('activities');
  const [leads, setLead] = useState(null);
  const {lead_id} = useParams()
  const dispatch = useDispatch()
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone_number: "",
    status: "",
    custome_fields: {},
  });

  console.log(lead_id);
  useEffect(() => {
    const fetchLead = async () => {
      const lead = await fetchLeadById(lead_id);
      console.log(lead);
      setLead(lead)
    };
  
    fetchLead(); 
  }, [lead_id,dispatch]);
  useEffect(() => {
    if (leads) {
      setLeadData({
        name: leads.name || "",
        email: leads.email || "",
        phone_number: leads.phone_number || "",
        status: leads.status || "",
        custome_fields: { ...leads.custome_fields },
      });
    }
  }, [leads]);
  const customeField = leads?.custome_fields

   
  const handleChange =(e)=>{
    const {name,value}= e.target
    if (name.startsWith("custom_")) {
      const key = name.replace("custom_", "");
      setLeadData((prev) => ({
        ...prev,
        custome_fields: {
          ...prev.custome_fields,
          [key]: value,
        },
      }));
    }
      else {
        setLeadData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };



  const activities = [
    {
      id: 1,
      type: 'email',
      title: 'Email Sent',
      date: 'April 10, 2025 at 2:30 PM',
      description: 'Sent product demo invitation email to John'
    },
    {
      id: 2,
      type: 'call',
      title: 'Phone Call',
      date: 'April 8, 2025 at 11:15 AM',
      description: 'Initial call to discuss needs and potential solutions. John expressed interest in our enterprise package.'
    },
    {
      id: 3,
      type: 'visit',
      title: 'Website Visit',
      date: 'April 5, 2025 at 3:42 PM',
      description: 'Visited pricing page and downloaded whitepaper'
    },
    {
      id: 4,
      type: 'form',
      title: 'Form Submission',
      date: 'April 5, 2025 at 3:45 PM',
      description: 'Submitted contact form requesting information about enterprise solutions'
    }
  ];

  const notes = [
    {
      id: 1,
      author: 'Sarah Johnson',
      date: 'April 8, 2025 at 11:45 AM',
      content: "John mentioned they're currently using Competitor X but experiencing scaling issues as their team grows. They need a solution that can handle 50+ users with advanced permission controls. Budget is around $15K-20K annually."
    },
    {
      id: 2,
      author: 'Mike Peterson',
      date: 'April 5, 2025 at 4:30 PM',
      content: "Initial research shows Acme Inc. has been growing rapidly in the past year. They've expanded to 3 new locations and increased staff by 30%. Good potential for our enterprise solution."
    }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Schedule product demo',
      dueDate: 'April 15, 2025',
      assignee: 'Sarah Johnson',
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      title: 'Send pricing proposal',
      dueDate: 'April 20, 2025',
      assignee: 'Sarah Johnson',
      priority: 'medium',
      completed: false
    },
    {
      id: 3,
      title: 'Initial qualification call',
      dueDate: 'April 8, 2025',
      assignee: 'Sarah Johnson',
      priority: 'medium',
      completed: true
    }
  ];

  const renderIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail size={16} className="text-blue-500" />;
      case 'call':
        return <Phone size={16} className="text-green-500" />;
      case 'visit':
        return <Globe size={16} className="text-purple-500" />;
      case 'form':
        return <FileText size={16} className="text-orange-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  const handleEdit = ()=>{
    

    const updatedata = {
      ...leadData,
      lead_id:leads.lead_id
    }

    dispatch(editLead(updatedata))

    

  }

  return (
    <DashboardLayout>
    <div className="flex min-h-screen">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lead Overview</h1>
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                <Phone size={16} className="mr-2" /> Call
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                <Mail size={16} className="mr-2" /> Email
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                <DollarSign size={16} className="mr-2" /> Convert to Deal
              </button>
            </div>
          </div>

          {/* Lead Profile Card */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    {leads?.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{leads?.name}</h2>
                    <p className="text-gray-600">{leads?.position} at {leads?.company}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {leads?.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div>
                  <DetailItem label="Email" value={leads?.email} />
                  <DetailItem label="Phone" value={leads?.phone_number} />

                </div>
                <div>
                  <DetailItem label="Lead Source" value={leads?.status} />
                  <DetailItem label="Lead Owner" value={leads?.employee?.name} />
                  <DetailItem label="Created Date" value={leads?.created_at.split('T')[0]} />
                </div>
                
                {
                  leads?.custome_fields &&
                  Object.entries(leads.custome_fields).map(([key, value]) => (
                    <DetailItem key={key} label={key} value={value} />
                  ))
                }
                
                
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <TabButton 
                  text="Activities" 
                  active={activeTab === 'activities'} 
                  onClick={() => setActiveTab('activities')} 
                />
                <TabButton 
                  text="Notes" 
                  active={activeTab === 'notes'} 
                  onClick={() => setActiveTab('notes')} 
                />
                <TabButton 
                  text="Tasks" 
                  active={activeTab === 'tasks'} 
                  onClick={() => setActiveTab('tasks')} 
                />
                <TabButton 
                  text="Edit Lead" 
                  active={activeTab === 'edit'} 
                  onClick={() => setActiveTab('edit')} 
                />
              </nav>
            </div>

            <div className="p-6">
              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <div>
                  {activities.map(activity => (
                    <div key={activity.id} className="flex py-4 border-b border-gray-200 last:border-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        {renderIcon(activity.type)}
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-sm text-gray-500">{activity.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      placeholder="Add a note..."
                      className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Add Note
                    </button>
                  </div>

                  {notes.map(note => (
                    <div key={note.id} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{note.author}</span>
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      placeholder="Add a task..."
                      className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Add Task
                    </button>
                  </div>

                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center p-4 border border-gray-200 rounded-md mb-3 bg-white">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        className="w-5 h-5 mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h4>
                          {task.priority === 'high' && (
                            <span className="ml-2 text-red-600 text-sm font-medium">(High Priority)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.completed ? 'Completed: ' : 'Due: '}
                          {task.dueDate} 
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {task.assignee}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <div>
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleEdit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                         Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={leadData.name}
                      />
                    </div>
                    
                    
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={leadData.email}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={leads.phone_number}
                      />
                    </div>
                    
                    
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Status
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md bg-white"
                       name="status"
                       onChange={handleChange}
                      value ={leadData.status || ""}
                      
                      >
                          
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Negotiation">Negotiation</option>
                      </select>
                    </div>
                    
                    
                
                    {leadData.custome_fields && Object.entries(leadData.custome_fields).map(([key, value]) => (
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key}
                      </label>
                      <input
                        type="text"
                        name={`custom_${key}`}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={value}
                      />
                    </div>))}
                    
                    
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option>Technology</option>
                        <option selected>Manufacturing</option>
                        <option>Healthcare</option>
                        <option>Finance</option>
                        <option>Retail</option>
                        <option>Education</option>
                      </select>
                    </div> */}
                    
                    <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}


const TabButton = ({ text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium ${
      active
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {text}
  </button>
);

const DetailItem = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-xs text-gray-500 uppercase font-medium mb-1">{label}</p>
    <p className="text-gray-800">{value}</p>
  </div>
);