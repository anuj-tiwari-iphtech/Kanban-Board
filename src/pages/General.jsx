import { useState, useRef, useEffect, useMemo } from "react";
import {HiOutlineUser,HiOutlineFilter,HiOutlineSortAscending,HiOutlineDotsHorizontal,HiPlus,} from "react-icons/hi";
import { useOutletContext } from "react-router-dom";
import { useAlert } from "../components/AlertModal/AlertContext";
import { useAuthContext } from "../auth/AuthContext";
import { writeBatch, doc} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { Link , useParams, useNavigate } from "react-router-dom";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import TaskModal from "../components/AddTaskModal/Modal";
import useClickOutside from "../customHooks/useClickOutside";
import AddColumnModal from "../components/KanbanBoard/AddColumnModal";
import useAllUsers from "../auth/users";
import "./general.css";

export default function General() {
  const users = useAllUsers()
  const {currentUser} = useAuthContext()
  const {searchTerm} = useOutletContext()
  const {taskId} = useParams()
  const {showAlert} = useAlert()
  const navigate = useNavigate()

  const {
    data: tasks,
    add : addTask,
    update : updateTask,
    batchUpdate,
  } = useFirestoreCollection("tasks",currentUser?.id, true)
  
  const {
    data:columns,
    add: addColumn,
    update: updateColumn,
  } = useFirestoreCollection("columns", currentUser?.id, true)

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

  const columnColors = ["blue", "yellow", "green", "purple", "red"];

  const sortedColumns = useMemo(()=>{
    return [...columns].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    );
  },[columns])
  
  useEffect(() => {
    if(taskId && tasks.length > 0){
      const foundTask = tasks.find((t) => t.id === taskId);
      if(foundTask){
        setEditingTask(foundTask);
        setIsModalOpen(true);
      }
    }
  },[taskId, tasks])

  const visibleTasks = useMemo(() => {
    let filtered = tasks.filter((t) => {
      if(!currentUser){
        return false;
      }
      if (isMyTicketsActive) {
        return t.assignee?.id === currentUser?.id;
      }
      if (filterUserId) {
        return t.assignee?.id === filterUserId;
      }
      return true; 
    });

    if (sortOrder) {
      const priorityOrder = {High:1, Medium:2, Low:3}

      filtered = [...filtered].sort((a,b) => {
        const aValue = priorityOrder[a.priority] || 99;
        const bValue = priorityOrder[b.priority] || 99;
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      })
    }

    return filtered
  },[tasks, currentUser,filterUserId, isMyTicketsActive, sortOrder])


  const handleActionClick = (action) => {
    if(!currentUser){
      showAlert("Please Login & Signup for this feature")
      return;
    }

    if (action === "my-tickets" && activeAction === "my-tickets") {
      setActiveAction(null);  
    } else {
      setActiveAction(action);
    }
  
    if (action === "add-task") {
      handleOpenModal();
    }
  };

  const handleMoreClick = () => {
    if( !currentUser || currentUser?.role === "restricted"){
      showAlert("You don't have permission to view this board feature. Contact your admin.")
      return;
    }
    handleActionClick("more")
    setShowColumnModal(true)
  }

  const handleOpenModal = (status = "TO DO") => {
    if(currentUser?.role === "restricted"){
      showAlert("You don't have permission to view this board feature. Contact your admin.")
      return;
    }
    setEditingTask(null);
    setDefaultStatus(status)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    if(taskId){
      navigate('/')
    }
  }

  const handleEditTask = (task) => {
    if(!currentUser){
      alert("Please Login & Signup for this feature")
      return;
    }
    setEditingTask(task);
    setIsModalOpen(true);
  }

  const handleAddTask = async (newTask) => {
    try {
      if (editingTask) {
        await updateTask(
          editingTask.id,
          newTask
        );
  
        showAlert("Task updated successfully!","success");
      } else {
        await addTask(newTask);
        showAlert("Task created successfully!","success");
      }
  
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      showAlert( "Failed to save task.","error");
    }
  };

  const handleAddColumn = async (title, position) => {
    const alreadyExists = columns.some(
      (column) => column.title.toLowerCase() === title.toLowerCase().trim()
    );
  
    if (alreadyExists) {
      showAlert("A column with this name already exists.", "error");
      return;
    }
  
    let insertPosition;
    if (position === "start") {
      insertPosition = 0;
    } else if (position === "end" || position === undefined || position === null) {
      insertPosition = columns.length; 
    } else {
      insertPosition = Number(position);
    }
  
    try {
      if (insertPosition < columns.length) {
        const updates = columns
          .filter((column) => (column.position ?? 0) >= insertPosition)
          .map((column) =>
            updateColumn(column.id, {
              position: (column.position ?? 0) + 1,
            })
          );
  
        await Promise.all(updates);
      }
  
      const newColumn = {
        title: title.trim(),
        color: columnColors[columns.length % columnColors.length],
        position: insertPosition,
        userId: currentUser?.id, 
      };
  
      await addColumn(newColumn);
      showAlert("Column added successfully!", "success");
    } catch (error) {
      console.error("Error adding column:", error);
      showAlert("Failed to add column.", "error");
    }
  };

  const handleDeleteColumn = async (columnTitle) => {
    const columnToDelete = columns.find((col) => col.title === columnTitle);
    if (!columnToDelete) return;
  
    try {
      const batch = writeBatch(db);
  
      const colRef = doc(db, "columns", columnToDelete.id);
      batch.delete(colRef);
  
      const tasksToDelete = tasks.filter((t) => t.status === columnTitle);
      tasksToDelete.forEach((task) => {
        const taskRef = doc(db, "tasks", task.id);
        batch.delete(taskRef);
      });
  
      await batch.commit();
      showAlert("Column deleted!", "success");
    } catch (error) {
      console.error("Batch delete failure:", error);
      showAlert("Failed to delete column.", "error");
    }
  };
 
  return (
    <div className="general-page">
      <div className={`general-content ${!currentUser } ? "blurred" : ""`}>
      <div className="general-header">
        <h1 className="main-heading">General</h1>

        <div className="general-actions">
          <button
            className={`action-btn ${activeAction === "add-task" ? "active" : ""}`}
            onClick={() => {handleActionClick("add-task")}}
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

          { currentUser && (
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
          )
          }
          
          { currentUser &&
            (
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
            )
          }
          

          <button
            className={`action-btn ${activeAction === "more" ? "active" : ""}`}
            onClick={handleMoreClick}
          >
            <HiOutlineDotsHorizontal />
          </button>
          
          </div>

      </div>
        <KanbanBoard 
          tasks={visibleTasks} 
          onUpdateTask={updateTask} 
          onBatchUpdate={batchUpdate}
          onAddTask={handleOpenModal}
          onEditTask={handleEditTask}
          columns={sortedColumns}
          onDeleteColumn={handleDeleteColumn}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
        />

          {
            showColumnModal && (
              <AddColumnModal
                onClose={() => setShowColumnModal(false)}
                onAdd={handleAddColumn}
                columns={sortedColumns}
              />
            )
          }

        {
          isModalOpen && (
            <TaskModal 
              onClose={handleModalClose} 
              onSave={handleAddTask} 
              defaultStatus={defaultStatus}
              editingTask={editingTask}
              columns={columns}
            />
          )
        }
      </div>

      {!currentUser && (
        <div className="logged-out-overlay">
          <div className="logged-out-message">
            <h2>Please log in to continue</h2>
            <p>You need to be signed in to view and manage the task</p>
            <div className="logged-out-actions">
              <Link to="/login" className="logged-out-btn primary">login</Link>
              <Link to="/sign-up" className="logged-out-btn secondary">Sign up</Link>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}