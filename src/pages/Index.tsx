
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProjectCard from '../components/ui/ProjectCard';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch projects from Supabase
const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, 
      name, 
      client_name, 
      created_at, 
      updated_at,
      columns (id)
    `)
    .eq('status', 'active')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  
  // Process the data to match our ProjectCard interface
  return data.map(project => {
    // For each project, count the number of collaborators (placeholder for now)
    const collaborators = 2;
    
    // Format the last updated time
    const lastUpdated = formatTimeAgo(new Date(project.updated_at));
    
    return {
      id: project.id,
      name: project.name,
      client: project.client_name,
      completedTasks: 0, // This will be replaced with actual data
      totalTasks: 0, // This will be replaced with actual data
      lastUpdated,
      collaborators
    };
  });
};

// Helper function to format time ago
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} heures`;
  return `${Math.floor(diffInSeconds / 86400)} jours`;
};

const Index: React.FC = () => {
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

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
            <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
            <p className="text-klyra-secondaryText mt-1">
              Gérez et suivez vos projets clients
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
                placeholder="Rechercher des projets..." 
              />
            </div>
            
            <Link to="/admin" className="bg-klyra-accent text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium hover:bg-blue-600 transition-colors">
              <PlusCircle size={16} className="mr-2" />
              Nouveau Projet
            </Link>
            
            <Link to="/admin" className="bg-white border border-klyra-border text-klyra-text py-2 px-4 rounded-lg flex items-center text-sm font-medium hover:bg-klyra-muted/50 transition-colors">
              <Settings size={16} className="mr-2" />
              Administration
            </Link>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="mt-8 text-center py-12">
            <p>Chargement des projets...</p>
          </div>
        ) : error ? (
          <div className="mt-8 text-center py-12">
            <p className="text-red-500">Erreur lors du chargement des projets.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-8 text-center py-12 border border-dashed border-klyra-border rounded-xl">
            <h3 className="text-lg font-medium">Aucun projet trouvé</h3>
            <p className="text-klyra-secondaryText mt-2">Commencez par créer un nouveau projet</p>
            <Link 
              to="/admin" 
              className="mt-4 inline-block bg-klyra-accent text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Créer un projet
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} {...project} index={index} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
