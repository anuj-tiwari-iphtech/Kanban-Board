import { useState } from "react";
import TaskCard from "./TaskCard";
import DroppableColumn from "./DroppableColumn";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter, MeasuringStrategy } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import "./KanbanBoard.css";

export default function KanbanBoard({ tasks, onUpdateTask, onBatchUpdate, onAddTask, onEditTask, columns, onDeleteColumn, searchTerm, sortOrder }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };  

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
  
    const { active, over } = event;
  
    if (!over || active.id === over.id) return;
  
    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;
  
    // 1. Moving to an empty column space
    const overColumn = columns.find((column) => column.title === over.id);
  
    if (overColumn) {
      if (activeTask.status === overColumn.title) return;
  
      const targetTasks = tasks
        .filter(
          (task) =>
            task.status === overColumn.title &&
            task.id !== activeTask.id
        )
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
      const updates = [
        {
          id: activeTask.id,
          data: {
            status: overColumn.title,
            order: targetTasks.length,
          },
        },
        ...targetTasks.map((task, index) => ({
          id: task.id,
          data: {
            order: index,
          },
        })),
      ];
  
      try {
        await onBatchUpdate(updates);
      } catch (error) {
        console.error("Error moving task:", error);
      }
  
      return;
    }
  
    const overTask = tasks.find((task) => task.id === over.id);
    if (!overTask) return;
  
    const isSameColumn = activeTask.status === overTask.status;
  
    const targetTasks = tasks
      .filter(
        (task) =>
          task.status === overTask.status &&
          task.id !== activeTask.id
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
    let overIndex = targetTasks.findIndex(
      (task) => task.id === overTask.id
    );
  
    if (overIndex === -1) return;
  
    if (isSameColumn && activeTask.order < overTask.order) {
      overIndex += 1;
    }
  
    targetTasks.splice(overIndex, 0, {
      ...activeTask,
      status: overTask.status,
    });
  
    const updates = targetTasks.map((task, index) => ({
      id: task.id,
      data: {
        status: overTask.status,
        order: index,
      },
    }));
  
    try {
      await onBatchUpdate(updates);
    } catch (error) {
      console.error("Error moving task:", error);
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
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="kanban-board">
        {columns.map((column) => {
          let columnTasks = filteredTasks
            .filter((t) => t.status === column.title)
            
            if (sortOrder) {
              columnTasks = columnTasks.sort((a, b) => {
                const aValue = priorityOrder[a.priority] || 99;
                const bValue = priorityOrder[b.priority] || 99;
                return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
              });
            } else {
              columnTasks = columnTasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            }

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
                  <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
                ))}
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}