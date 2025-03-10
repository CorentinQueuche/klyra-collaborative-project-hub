
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProjectBoard from '../components/ui/ProjectBoard';
import { Search, Filter, Plus, Share2, Users, Bell } from 'lucide-react';
import { Task } from '../components/ui/Column';
import { motion } from 'framer-motion';

// Mock data for the project
const projectData = {
  id: '1',
  name: 'Website Redesign',
  client: 'Acme Inc',
  description: 'Complete redesign of the corporate website with focus on user experience and conversion optimization.',
  columns: [
    {
      id: 'col1',
      title: 'To Do',
      tasks: [
        {
          id: 'task1',
          title: 'Competitor analysis',
          description: 'Research and analyze the top 5 competitors websites',
          dueDate: 'Sep 15',
          priority: 'medium' as const,
          attachments: 2,
          comments: 3
        },
        {
          id: 'task2',
          title: 'Sitemap creation',
          description: 'Create a comprehensive sitemap for the new website structure',
          dueDate: 'Sep 18',
          priority: 'high' as const,
          comments: 1
        },
        {
          id: 'task3',
          title: 'Content audit',
          description: 'Review existing content and identify gaps for the new site',
          dueDate: 'Sep 20',
          priority: 'medium' as const
        }
      ]
    },
    {
      id: 'col2',
      title: 'In Progress',
      tasks: [
        {
          id: 'task4',
          title: 'Wireframes',
          description: 'Create wireframes for key pages including homepage, about, services',
          dueDate: 'Sep 12',
          priority: 'high' as const,
          attachments: 5,
          comments: 8
        },
        {
          id: 'task5',
          title: 'Brand style guide',
          description: 'Develop a comprehensive brand style guide for consistent design',
          dueDate: 'Sep 14',
          priority: 'medium' as const,
          attachments: 1
        }
      ]
    },
    {
      id: 'col3',
      title: 'To Review',
      tasks: [
        {
          id: 'task6',
          title: 'Homepage design',
          description: 'High-fidelity design of the homepage based on approved wireframes',
          dueDate: 'Sep 10',
          priority: 'high' as const,
          attachments: 3,
          comments: 5
        }
      ]
    },
    {
      id: 'col4',
      title: 'Completed',
      tasks: [
        {
          id: 'task7',
          title: 'Kick-off meeting',
          description: 'Initial project planning and scope definition with client',
          dueDate: 'Sep 5',
          priority: 'low' as const,
          comments: 2
        },
        {
          id: 'task8',
          title: 'User personas',
          description: 'Create detailed user personas based on client's target audience',
          dueDate: 'Sep 8',
          priority: 'medium' as const,
          attachments: 2
        }
      ]
    }
  ]
};

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Find the project by ID (in a real app, this would fetch from an API)
  const project = projectData;
  
  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl">Project not found</h2>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-klyra-secondaryText bg-klyra-muted px-2 py-1 rounded-full">
                {project.client}
              </span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-1">{project.name}</h1>
            <p className="text-klyra-secondaryText mt-1 max-w-2xl">
              {project.description}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
              <Bell size={16} className="mr-2" />
              Notifications
            </button>
            <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
              <Users size={16} className="mr-2" />
              Team
            </button>
            <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
              <Share2 size={16} className="mr-2" />
              Share
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-klyra-secondaryText" />
            </div>
            <input 
              type="search" 
              className="bg-white block w-full sm:w-64 py-2 pl-10 pr-4 subtle-ring-focus border border-klyra-border rounded-lg text-sm" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-2">
            <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
            <button className="bg-klyra-accent text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600 transition-colors">
              <Plus size={16} className="mr-2" />
              Add Task
            </button>
          </div>
        </motion.div>
        
        <ProjectBoard columns={project.columns} />
      </div>
    </MainLayout>
  );
};

export default Project;
