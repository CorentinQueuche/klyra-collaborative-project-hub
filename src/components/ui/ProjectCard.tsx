
import React from 'react';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  id: string;
  name: string;
  client: string;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: string;
  collaborators: number;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  client,
  completedTasks,
  totalTasks,
  lastUpdated,
  collaborators,
  index
}) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/project/${id}`}>
        <div className="glass-panel rounded-xl card-hover p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-medium text-klyra-secondaryText bg-klyra-muted px-2 py-1 rounded-full">
                {client}
              </span>
              <h3 className="text-lg font-medium mt-2">{name}</h3>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-klyra-secondaryText">Progress</span>
              <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
            </div>
            <div className="h-2 bg-klyra-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-klyra-accent rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-klyra-secondaryText">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>Updated {lastUpdated}</span>
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{collaborators} collaborators</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
