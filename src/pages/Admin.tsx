
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectForm {
  name: string;
  clientName: string;
  description: string;
}

const Admin: React.FC = () => {
  const [form, setForm] = useState<ProjectForm>({
    name: '',
    clientName: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.clientName) {
      toast({
        title: "Erreur",
        description: "Le nom du projet et le nom du client sont requis",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Insert the new project into the database
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            name: form.name, 
            client_name: form.clientName, 
            description: form.description,
            access_link: await generateUniqueLink()
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Projet créé",
        description: "Le projet a été créé avec succès",
      });
      
      // Navigate to the project page
      navigate(`/project/${data.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du projet",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a unique access link by calling our secure function
  const generateUniqueLink = async () => {
    const { data, error } = await supabase.rpc('generate_secure_access_link');
    
    if (error) {
      console.error('Error generating link:', error);
      throw error;
    }
    
    return data;
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Créer un nouveau projet</h1>
          <p className="text-klyra-secondaryText mt-1">
            Créez un projet et partagez le lien d'accès avec votre client
          </p>
        </motion.div>
        
        <motion.div
          className="glass-panel rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Nom du projet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border border-klyra-border rounded-lg bg-white"
                placeholder="ex: Refonte de site web"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="clientName">
                Nom du client
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                value={form.clientName}
                onChange={handleChange}
                className="w-full p-2 border border-klyra-border rounded-lg bg-white"
                placeholder="ex: Acme Inc"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description (optionnelle)
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border border-klyra-border rounded-lg bg-white h-24"
                placeholder="Décrivez brièvement l'objectif du projet..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-klyra-accent text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer le projet"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Admin;
