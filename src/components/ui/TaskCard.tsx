
import React from 'react';
import { Calendar, Paperclip, MessageCircle } from 'lucide-react';
import { Task } from './Column';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: 'bg-blue-50 text-blue-600',
  medium: 'bg-amber-50 text-amber-600',
  high: 'bg-rose-50 text-rose-600'
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-sm border border-klyra-border/50 p-3 cursor-pointer"
    >
      <div className="mb-2 flex justify-between items-start">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-klyra-secondaryText mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-klyra-secondaryText">
        <div className="flex space-x-3">
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              {task.dueDate}
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          {task.attachments !== undefined && task.attachments > 0 && (
            <div className="flex items-center">
              <Paperclip size={12} className="mr-1" />
              {task.attachments}
            </div>
          )}
          
          {task.comments !== undefined && task.comments > 0 && (
            <div className="flex items-center">
              <MessageCircle size={12} className="mr-1" />
              {task.comments}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
