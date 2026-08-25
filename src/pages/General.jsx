import { useState, useRef, useEffect } from "react";
import {HiOutlineUser,HiOutlineFilter,HiOutlineSortAscending,HiOutlineDotsHorizontal,HiPlus,} from "react-icons/hi";
import { useOutletContext } from "react-router-dom";
import { useAlert } from "../components/AlertModal/AlertContext";
import { useAuthContext } from "../auth/AuthContext";
import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import TaskModal from "../components/AddTaskModal/Modal";
import useClickOutside from "../customHooks/useClickOutside";
import AddColumnModal from "../components/KanbanBoard/AddColumnModal";
import "./general.css";

const defaultColumns = [
  { title: "TO DO", color: "blue" },
  { title: "IN PROGRESS", color: "yellow" },
  { title: "REVIEW", color: "blue" },
  { title: "DONE", color: "green" },
];

export default function General() {
  const {currentUser} = useAuthContext()
  const {searchTerm} = useOutletContext()

  const {
    data: tasks,
    loading: taskLoading,
    add : addTask,
    update : updateTask,
    remove : deleteTask,
  } = useFirestoreCollection("tasks",currentUser?.id)
  
  const {
    data:columns,
    loading: columnLoading,
    add: addColumn,
    update: updateColumn,
    remove: deleteColumn,
  } = useFirestoreCollection("columns", currentUser?.id)

  const [activeAction, setActiveAction] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState("TO DO")
  const [filterUserId, setFilterUserId] = useState(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState(null)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [editingTask, setEditingTask] = useState(null);
  const [showColumnModal, setShowColumnModal] = useState(false)

  const {showAlert} = useAlert()

  const filterRef = useRef(null);
  const sortRef = useRef(null)

  useClickOutside(filterRef, () => setShowFilterMenu(false))
  useClickOutside(sortRef, ()=> setShowSortMenu(false))

  const isMyTicketsActive = activeAction === "my-tickets"
  const priorityOrder = {High:1, Medium:2, Low:3}

  const columnColors = ["blue", "yellow", "green", "purple", "red"];

  useEffect(() => {
    if (!currentUser?.id || columnLoading || (columns && columns.length > 0)) return;
  
    const seedDefaultColumns = async () => {
      try {
        const batch = writeBatch(db);
  
        defaultColumns.forEach((col) => {
          const colRef = doc(collection(db, "columns"));
          batch.set(colRef, {
            ...col,
            userId: currentUser.id,
          });
        });
  
        await batch.commit();
      } catch (error) {
        console.error("Error seeding default columns:", error);
      }
    };
    seedDefaultColumns();
  }, [currentUser?.id, columnLoading, columns]);

  const activeColumns = columns && columns.length > 0 ? columns : defaultColumns;

    const sortedColumns = [...activeColumns].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    );

  const isRestricted = currentUser?.role === "restricted";

  let visibleTasks = tasks.filter((t) => {
    if(!currentUser){
      return false;
    }

    if(isRestricted){
      return t.assignee?.id === currentUser?.id
    }
    if (isMyTicketsActive) {
      return t.assignee?.id === currentUser?.id;
    }
    if (filterUserId) {
      return t.assignee?.id === filterUserId;
    }
    return true; 
  });

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

  if (sortOrder) {
    visibleTasks = [...visibleTasks].sort((a,b) => {
      const aValue = priorityOrder[a.priority] || 99;
      const bValue = priorityOrder[b.priority] || 99;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    })
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
      (column) => column.title === title
    );
  
    if (alreadyExists) {
      showAlert(
        "A column with this name already exists.",
        "error"
      );
      return;
    }
  
    const newColumn = {
      title,
      color:
        columnColors[
          columns.length % columnColors.length
        ],
      position:
        position === "start"
          ? 0
          : Number(position),
    };
  
    try {
      await addColumn(newColumn)
      showAlert("Column added successfully!", "success");
    } catch (error) {
      console.error("Error adding column:", error);
      showAlert("Failed to add column.","error");
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
          onAddTask={handleOpenModal}
          onEditTask={handleEditTask}
          columns={sortedColumns}
          onDeleteColumn={handleDeleteColumn}
          searchTerm={searchTerm}
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