import React, { useState } from 'react';
import Column, { Task } from './Column';
import { motion } from 'framer-motion';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { useToast } from "@/hooks/use-toast";

interface ProjectBoardProps {
  columns: {
    id: string;
    title: string;
    tasks: Task[];
  }[];
  readOnly?: boolean;
  onDragEnd?: (result: DropResult, columns: any) => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ 
  columns: initialColumns, 
  readOnly = false,
  onDragEnd: externalDragEndHandler 
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const { toast } = useToast();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If no destination or dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Create a new columns array
    const newColumns = [...columns];
    
    // Find source and destination column indices
    const sourceColIndex = newColumns.findIndex(col => col.id === source.droppableId);
    const destColIndex = newColumns.findIndex(col => col.id === destination.droppableId);
    
    // Get the task that was dragged
    const task = newColumns[sourceColIndex].tasks[source.index];
    
    // Remove task from source column
    newColumns[sourceColIndex].tasks.splice(source.index, 1);
    
    // Add task to destination column
    newColumns[destColIndex].tasks.splice(destination.index, 0, task);
    
    // Update state
    setColumns(newColumns);
    
    // Show success notification
    toast({
      title: "Tâche déplacée",
      description: `${task.title} déplacée vers ${newColumns[destColIndex].title}`,
    });

    // Call external handler if provided (for database updates)
    if (externalDragEndHandler) {
      externalDragEndHandler(result, newColumns);
    }
  };

  // Wrap the component based on readOnly flag
  const Board = () => (
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
            id={column.id}
            readOnly={readOnly}
          />
        ))}
      </div>
    </motion.div>
  );

  // If readOnly, don't wrap in DragDropContext
  if (readOnly) {
    return <Board />;
  }

  // Otherwise, enable drag and drop
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Board />
    </DragDropContext>
  );
};

export default ProjectBoard;
