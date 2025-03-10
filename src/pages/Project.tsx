
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProjectBoard from '../components/ui/ProjectBoard';
import { Search, Filter, Plus, Share2, Users, Bell, Copy, Check } from 'lucide-react';
import { Task } from '../components/ui/Column';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch project data by ID
const fetchProject = async (id: string) => {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (projectError) throw projectError;
  
  // Fetch columns for the project
  const { data: columns, error: columnsError } = await supabase
    .from('columns')
    .select('id, name, order')
    .eq('project_id', id)
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

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [accessLinkCopied, setAccessLinkCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id || ''),
    enabled: !!id
  });
  
  // Reset the copied state after 2 seconds
  useEffect(() => {
    if (accessLinkCopied) {
      const timer = setTimeout(() => {
        setAccessLinkCopied(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [accessLinkCopied]);
  
  const handleCopyAccessLink = () => {
    if (!project) return;
    
    const clientViewUrl = `${window.location.origin}/view/${project.access_link}`;
    navigator.clipboard.writeText(clientViewUrl);
    
    setAccessLinkCopied(true);
    
    toast({
      title: "Lien copié",
      description: "Le lien d'accès a été copié dans le presse-papier"
    });
  };
  
  const handleCardMoved = async (result: any, columns: any) => {
    // This function will be implemented to update the database when cards are moved
    // For now, we'll just log the result
    console.log('Card moved:', result);
    
    // In a real implementation, you would update the database here
    try {
      // Get the source and destination columns
      const sourceColId = result.source.droppableId;
      const destColId = result.destination.droppableId;
      
      // Get the card that was moved
      const cardId = result.draggableId;
      
      // Update the card's column_id and order in the database
      const { error } = await supabase
        .from('cards')
        .update({ 
          column_id: destColId,
          order: result.destination.index 
        })
        .eq('id', cardId);
      
      if (error) throw error;
      
      // Record this activity
      await supabase
        .from('activities')
        .insert({
          project_id: id,
          card_id: cardId,
          action_type: 'move_card',
          action_details: {
            from_column: sourceColId,
            to_column: destColId,
            new_order: result.destination.index
          },
          performed_by: 'Admin' // In a real app, this would be the logged-in user
        });
      
    } catch (error: any) {
      console.error('Error updating card position:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la position de la carte",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl">Chargement du projet...</h2>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl">Projet non trouvé</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-klyra-accent text-white py-2 px-4 rounded-lg text-sm"
          >
            Retour à l'accueil
          </button>
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
                {project.client_name}
              </span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {project.status === 'active' ? 'Actif' : 'Archivé'}
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-1">{project.name}</h1>
            <p className="text-klyra-secondaryText mt-1 max-w-2xl">
              {project.description || "Aucune description"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
              <Bell size={16} className="mr-2" />
              Notifications
            </button>
            <button className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors">
              <Users size={16} className="mr-2" />
              Équipe
            </button>
            <button 
              className="bg-white border border-klyra-border text-klyra-text px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-klyra-muted/50 transition-colors"
              onClick={handleCopyAccessLink}
            >
              {accessLinkCopied ? (
                <>
                  <Check size={16} className="mr-2 text-green-500" />
                  Lien copié
                </>
              ) : (
                <>
                  <Share2 size={16} className="mr-2" />
                  Partager
                </>
              )}
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
            <button className="bg-klyra-accent text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600 transition-colors">
              <Plus size={16} className="mr-2" />
              Ajouter une tâche
            </button>
          </div>
        </motion.div>
        
        <ProjectBoard columns={project.columns} onDragEnd={handleCardMoved} />
      </div>
    </MainLayout>
  );
};

export default Project;
