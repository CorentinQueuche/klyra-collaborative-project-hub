
import React from 'react';
import { SlideUp } from '../animations/Transitions';
import TaskCard from './TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: number;
  comments?: number;
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  index: number;
  readOnly?: boolean;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, index, readOnly = false }) => {
  // For a read-only view, render without Droppable
  if (readOnly) {
    return (
      <SlideUp delay={index * 0.1} className="min-w-[280px] w-full">
        <div className="flex flex-col h-full rounded-xl bg-klyra-muted/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-klyra-secondaryText px-2">
              {title} <span className="ml-2 text-xs bg-white py-1 px-2 rounded-full">{tasks.length}</span>
            </h3>
          </div>
          
          <div className="flex-1 overflow-auto">
            <div className="space-y-3">
              {tasks.map((task, taskIndex) => (
                <TaskCard key={task.id} task={task} index={taskIndex} />
              ))}
              
              {tasks.length === 0 && (
                <div className="h-24 rounded-lg border border-dashed border-klyra-border bg-white/50 flex items-center justify-center p-4">
                  <p className="text-sm text-klyra-secondaryText text-center">Aucune tâche</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SlideUp>
    );
  }
  
  // For normal view with drag and drop
  return (
    <SlideUp delay={index * 0.1} className="min-w-[280px] w-full">
      <div className="flex flex-col h-full rounded-xl bg-klyra-muted/50 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-klyra-secondaryText px-2">
            {title} <span className="ml-2 text-xs bg-white py-1 px-2 rounded-full">{tasks.length}</span>
          </h3>
        </div>
        
        <Droppable droppableId={id}>
          {(provided) => (
            <div 
              className="flex-1 overflow-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="space-y-3">
                {tasks.map((task, taskIndex) => (
                  <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? "opacity-75" : ""}
                      >
                        <TaskCard task={task} index={taskIndex} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {tasks.length === 0 && (
                  <div className="h-24 rounded-lg border border-dashed border-klyra-border bg-white/50 flex items-center justify-center p-4">
                    <p className="text-sm text-klyra-secondaryText text-center">Aucune tâche</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Droppable>
        
        <button className="mt-3 text-sm text-klyra-secondaryText hover:text-klyra-accent flex items-center justify-center py-2 rounded-lg bg-white/80 border border-klyra-border/50 transition-colors">
          + Ajouter une tâche
        </button>
      </div>
    </SlideUp>
  );
};

export default Column;
