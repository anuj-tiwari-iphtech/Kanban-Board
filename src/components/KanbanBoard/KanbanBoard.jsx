import { useState } from "react";
import TaskCard from "./TaskCard";
import DroppableColumn from "./DroppableColumn";
import { DndContext,DragOverlay,closestCorners,PointerSensor,useSensor, useSensors } from "@dnd-kit/core";
import {SortableContext,verticalListSortingStrategy,arrayMove,} from "@dnd-kit/sortable";
import "./KanbanBoard.css";


export default function KanbanBoard({tasks, setTasks, onAddTask}) {

  const [activeTask, setActiveTask] = useState(null);

  const columns = [
    {title: "TO DO",color: "blue",},
    {title: "IN PROGRESS",color: "yellow",},
    {title: "REVIEW",color: "blue",},
    {title: "DONE",color: "green",},
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint : {distance: 5},
    })
  )

  const handleDragStart = (event) =>{
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    setActiveTask(null)

    const {active, over} = event;
    if(!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if(!activeTask) return;

    const overColumn = columns.find((c) => c.title === over.id);
    if(overColumn){
      setTasks((prev) => 
      prev.map((t) =>
        t.id === active.id ? {...t, status : overColumn.title} : t
      ))
      return
    }

    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.id !== overTask.id) {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === activeTask.id ? { ...t, status: overTask.status } : t
        );

        const oldIndex = updated.findIndex((t) => t.id === active.id);
        const newIndex = updated.findIndex((t) => t.id === over.id);

        return arrayMove(updated, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.title);

          return (
            <DroppableColumn
              key={column.title}
              column={column}
              count={columnTasks.length}
              onAddTask={() => onAddTask(column.title)}
            >
              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
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