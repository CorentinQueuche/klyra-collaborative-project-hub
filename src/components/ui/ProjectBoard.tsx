
import React from 'react';
import Column, { Task } from './Column';
import { motion } from 'framer-motion';

interface ProjectBoardProps {
  columns: {
    id: string;
    title: string;
    tasks: Task[];
  }[];
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ columns }) => {
  return (
    <motion.div 
      className="flex-1 mt-6 pb-6 overflow-x-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-4 h-full min-h-[70vh]">
        {columns.map((column, index) => (
          <Column 
            key={column.id} 
            title={column.title} 
            tasks={column.tasks} 
            index={index} 
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectBoard;
