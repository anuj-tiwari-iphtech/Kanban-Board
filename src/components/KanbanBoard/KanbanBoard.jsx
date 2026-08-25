import { useState } from "react";
import TaskCard from "./TaskCard";
import DroppableColumn from "./DroppableColumn";
import { DndContext,DragOverlay,closestCorners,PointerSensor,useSensor, useSensors } from "@dnd-kit/core";
import {SortableContext,verticalListSortingStrategy,arrayMove,} from "@dnd-kit/sortable";
import "./KanbanBoard.css";

export default function KanbanBoard({tasks, onUpdateTask, onAddTask, onEditTask, columns, onDeleteColumn, searchTerm}) {

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint : {distance: 5},
    })
  )

  const handleDragStart = (event) =>{
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
  
    if (!over) return;
  
    const activeTask = tasks.find((task) => task.id === active.id);
  
    if (!activeTask) return;

    const overColumn = columns.find((column) => column.title === over.id);
  
    if (overColumn) {
      if (activeTask.status === overColumn.title) {
        return;
      }
  
      try {
        await onUpdateTask(activeTask.id, {
          status: overColumn.title,
        });
      } catch (error) {
        console.error("Error moving task:", error);
      }
      return;
    }
  
    const overTask = tasks.find(
      (task) => task.id === over.id
    );
  
    if ( overTask && activeTask.id !== overTask.id) {
      try { await onUpdateTask(activeTask.id, {
          status: overTask.status,
        });
      } catch (error) {
        console.error("Error moving task:",error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm?.toLowerCase().trim();
  
    if (!search) return true;
  
    return (
      task.name?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    );
  });


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status === column.title);

          return (
            <DroppableColumn
              key={column.title}
              column={column}
              count={columnTasks.length}
              onAddTask={() => onAddTask(column.title)}
              onDeleteColumn={() => onDeleteColumn(column.title)}
            >
              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit = {() => onEditTask(task)} />
                ))}
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay/> : null}
        </DragOverlay>
    </DndContext>
  );
}