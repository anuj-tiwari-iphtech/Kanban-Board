import { useState, useRef } from "react";
import {HiOutlineUser,HiOutlineFilter,HiOutlineSortAscending,HiOutlineDotsHorizontal,HiPlus,} from "react-icons/hi";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import TaskModal from "../components/AddTaskModal/Modal";
import useClickOutside from "../customHooks/useClickOutside";
import useLocalStorage from "../customHooks/useLocalStorage";
import "./general.css";
import AddColumnModal from "../components/KanbanBoard/AddColumnModal";

const defaultColumns = [
  { title: "TO DO", color: "blue" },
  { title: "IN PROGRESS", color: "yellow" },
  { title: "REVIEW", color: "blue" },
  { title: "DONE", color: "green" },
];

export default function General() {
  const [users] = useLocalStorage("kanban-users",[]);
  const [currentUser] = useLocalStorage("kanban-current-user",null);
  const [tasks, setTasks] = useLocalStorage("Kanban-tasks", [])
  const [columns, setColumns] = useLocalStorage("kanban-columns", defaultColumns);

  const [activeAction, setActiveAction] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState("TO DO")
  const [filterUserId, setFilterUserId] = useState(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState(null)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [editingTask, setEditingTask] = useState(null);
  const [showColumnModal, setShowColumnModal] = useState(false)

  const filterRef = useRef(null);
  const sortRef = useRef(null)

  useClickOutside(filterRef, () => setShowFilterMenu(false))
  useClickOutside(sortRef, ()=> setShowSortMenu(false))

  const isMyTicketsActive = activeAction === "my-tickets"
  const priorityOrder = {High:1, Medium:2, Low:3}

  const columnColors = ["blue", "yellow", "green", "purple", "red"];

  let visibleTasks = tasks.filter((t) => {
    if (isMyTicketsActive) {
      return t.assignee?.id === currentUser?.id;
    }
    if (filterUserId) {
      return t.assignee?.id === filterUserId;
    }
    return true; 
  });

  const handleActionClick = (action) => {
    if (action === "my-tickets" && activeAction === "my-tickets") {
      setActiveAction(null);  
    } else {
      setActiveAction(action);
    }
  
    if (action === "add-task") {
      handleOpenModal();
    }
  };

  if (sortOrder) {
    visibleTasks = [...visibleTasks].sort((a,b) => {
      const aValue = priorityOrder[a.priority] || 99;
      const bValue = priorityOrder[b.priority] || 99;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    })
  }

  const handleOpenModal = (status = "TO DO") => {
    setEditingTask(null);
    setDefaultStatus(status)
    setIsModalOpen(true)
  }
  
  const handleModalClose = () => {
    setIsModalOpen(false)
    setActiveAction(null)
  }

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  const handleAddTask = (newTask) =>{
    console.log("Adding task to state:", newTask);
    if(editingTask){
      setTasks((prev) => 
        prev.map((t) => (t.id === editingTask.id ? {...newTask, id: editingTask.id} : t) )
      )
    }else{
      setTasks((prev) => [...prev, newTask]);
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleAddColumn = (title, position) => {
    const alreadyExists = columns.some((c) => c.title === title);
    if(alreadyExists) return;

    const newColumn = {
      title,
      color: columnColors[columns.length % columnColors.length],
    }

    setColumns((prev) => {
      if(position === "start"){
        return [newColumn, ...prev];
      }

      const insertIndex = Number(position)
      const updated = [...prev]
      updated.splice(insertIndex, 0 , newColumn);
      return updated;
    })
  }

  const handleDeleteColumn = (title) => {
    setColumns((prev) => prev.filter((c) => c.title !== title))
    setTasks((prev) => prev.filter((t) => t.status !== title))
  }
 
  return (
    <div className="general-page">
      <div className="general-header">
        <h1 className="main-heading">General</h1>

        <div className="general-actions">
          <button
            className={`action-btn ${activeAction === "add-task" ? "active" : ""}`}
            onClick={() => {handleActionClick("add-task"), handleOpenModal()}}
          >
            <HiPlus />
            <span>Add task</span>
          </button>

          <button
            className={`action-btn ${activeAction === "my-tickets" ? "active" : ""}`}
            onClick={() => handleActionClick("my-tickets")}
          >
            <HiOutlineUser />
            <span>My Tickets</span>
          </button>

          <div className="filter-wrapper" ref={filterRef}>
            <button
              className={`action-btn ${activeAction === "filter" ? "active" : ""}`}
              onClick={() => {
                handleActionClick("filter")
                setShowFilterMenu((prev) => !prev);
              }}
            >
              <HiOutlineFilter />
              <span>{filterUserId ? users.find(u => u.id === filterUserId)?.name : "Filter"}</span>
            </button>

            {showFilterMenu && (
              <div className="filter-menu">
                <button
                  className={`filter-option ${filterUserId === null ? "active" : ""}`}
                  onClick={() => {
                    setFilterUserId(null)
                    setShowFilterMenu(false)
                  }}
                >All Users</button> 

                {users.map((user) => (
                  <button
                    key={user.id}
                    className={`filter-option ${filterUserId === user.id ? "active" : ""}`}
                    onClick={() => {
                        setFilterUserId(user.id);
                        setShowFilterMenu(false);
                    }}
                  >
                    <img src={user.avatar} className="option-avatar"/>
                    {user.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sort-wrapper" ref={sortRef}>
            <button
              className={`action-btn ${activeAction === "sort" ? "active" : ""}`}
              onClick={() => {
                handleActionClick("sort")
                setShowSortMenu((prev) => !prev)
              }}
            >
              <HiOutlineSortAscending />
              <span>Sort</span>
            </button>

              {showSortMenu && (
                <div className="sort-menu">
                  <button className={`sort-option ${sortOrder === null ? "active" : ""}`}
                    onClick={() => {
                      setSortOrder(null);
                      setShowSortMenu(false)
                    }}
                  >
                    Default
                  </button>
                    <button
                      className={`sort-option ${sortOrder === "asc" ? "active" : ""}`}
                      onClick={() => {
                        setSortOrder("asc");
                        setShowSortMenu(false)
                      }}
                    >
                      Priority: High to Low
                    </button>
                    <button
                      className={`sort-option ${sortOrder === "desc" ? "active" : ""}`}
                      onClick={() => {
                        setSortOrder("desc");
                        setShowSortMenu(false)
                      }}
                    >
                      Priority: Low to High
                    </button>
                </div>
              )}

          </div>

          <button
            className={`action-btn ${activeAction === "more" ? "active" : ""}`}
            onClick={() => {
              handleActionClick("more")
              setShowColumnModal(true)
            }}
          >
            <HiOutlineDotsHorizontal />
          </button>
          
          </div>

      </div>
        <KanbanBoard 
          tasks={visibleTasks} 
          setTasks={setTasks} 
          onAddTask={handleOpenModal}
          onEditTask={handleEditTask}
          columns={columns}
          onDeleteColumn={handleDeleteColumn}
        />

          {
            showColumnModal && (
              <AddColumnModal
                onClose={() => setShowColumnModal(false)}
                onAdd={handleAddColumn}
                columns={columns}
              />
            )
          }

        {
          isModalOpen && (
            <TaskModal 
              onClose={() => {setIsModalOpen(false), setEditingTask(null)}} 
              onSave={handleAddTask} 
              defaultStatus={defaultStatus}
              editingTask={editingTask}
              columns={columns}
            />
          )
        }
      </div>
  );
}