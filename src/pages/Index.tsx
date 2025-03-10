
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProjectCard from '../components/ui/ProjectCard';
import { motion } from 'framer-motion';
import { PlusCircle, Search } from 'lucide-react';

// Mock data for projects
const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    client: 'Acme Inc',
    completedTasks: 18,
    totalTasks: 24,
    lastUpdated: '2 hours ago',
    collaborators: 4
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: 'TechStart',
    completedTasks: 8,
    totalTasks: 32,
    lastUpdated: '1 day ago',
    collaborators: 6
  },
  {
    id: '3',
    name: 'Brand Identity',
    client: 'FreshBrand',
    completedTasks: 24,
    totalTasks: 30,
    lastUpdated: '3 days ago',
    collaborators: 3
  },
  {
    id: '4',
    name: 'Marketing Campaign',
    client: 'GrowthCorp',
    completedTasks: 0,
    totalTasks: 20,
    lastUpdated: 'Just started',
    collaborators: 2
  }
];

const Index: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-klyra-secondaryText mt-1">
              Manage and track your client projects
            </p>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-klyra-secondaryText" />
              </div>
              <input 
                type="search" 
                className="bg-white block w-full py-2 pl-10 pr-4 subtle-ring-focus border border-klyra-border rounded-lg text-sm" 
                placeholder="Search projects..." 
              />
            </div>
            
            <button className="bg-klyra-accent text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium hover:bg-blue-600 transition-colors">
              <PlusCircle size={16} className="mr-2" />
              New Project
            </button>
          </div>
        </motion.div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} {...project} index={index} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
