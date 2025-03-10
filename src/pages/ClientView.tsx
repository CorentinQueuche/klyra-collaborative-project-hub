import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectBoard from '../components/ui/ProjectBoard';
import { Search, Filter } from 'lucide-react';
import { Task } from '../components/ui/Column';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch project data by access link
const fetchProjectByAccessLink = async (accessLink: string) => {
  // Use custom header instead of setAuthHeader (which doesn't exist on FunctionsClient)
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('access_link', accessLink)
    .single();
  
  if (projectError) throw projectError;
  
  // Fetch columns for the project
  const { data: columns, error: columnsError } = await supabase
    .from('columns')
    .select('id, name, order')
    .eq('project_id', project.id)
    .order('order');
  
  if (columnsError) throw columnsError;
  
  // For each column, fetch its cards
  const columnsWithCards = await Promise.all(
    columns.map(async (column) => {
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('id, title, description, due_date, priority, order')
        .eq('column_id', column.id)
        .order('order');
      
      if (cardsError) throw cardsError;
      
      // Transform cards to match our Task interface
      const tasks: Task[] = cards.map(card => ({
        id: card.id,
        title: card.title,
        description: card.description || undefined,
        dueDate: card.due_date ? new Date(card.due_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : undefined,
        priority: (card.priority?.toLowerCase() as 'low' | 'medium' | 'high') || 'medium'
      }));
      
      return {
        id: column.id,
        title: column.name,
        tasks
      };
    })
  );
  
  return {
    ...project,
    columns: columnsWithCards
  };
};

const ClientView: React.FC = () => {
  const { accessLink } = useParams<{ accessLink: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project-client-view', accessLink],
    queryFn: () => fetchProjectByAccessLink(accessLink || ''),
    enabled: !!accessLink
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-klyra-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-xl">Chargement du projet...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="min-h-screen bg-klyra-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-xl">Lien de projet invalide ou expiré</h2>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 bg-klyra-accent text-white py-2 px-4 rounded-lg text-sm"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-klyra-background">
      <header className="py-4 px-6 border-b border-klyra-border bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Klyra</h1>
            <div>
              <span className="text-sm text-klyra-secondaryText">Vue client</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-klyra-secondaryText bg-klyra-muted px-2 py-1 rounded-full">
                  {project.client_name}
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1">{project.name}</h1>
              <p className="text-klyra-secondaryText mt-1 max-w-2xl">
                {project.description || "Aucune description"}
              </p>
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
                placeholder="Rechercher des tâches..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-2">
              <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
                <Filter size={16} className="mr-2" />
                Filtre
              </button>
            </div>
          </motion.div>
          
          <ProjectBoard 
            columns={project.columns} 
            readOnly={true} // Make the board read-only for clients
          />
        </div>
      </main>
      
      <footer className="py-6 border-t border-klyra-border">
        <div className="container mx-auto px-4 text-center text-sm text-klyra-secondaryText">
          <p>&copy; {new Date().getFullYear()} Klyra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ClientView;
