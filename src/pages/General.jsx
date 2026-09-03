import { useState, useRef, useEffect, useMemo } from "react";
import {
  HiOutlineUser,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineDotsHorizontal,
  HiPlus,
  HiChevronDown,
  HiOutlineAdjustments,
  HiX,
} from "react-icons/hi";
import { useOutletContext, Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useAlert } from "../components/AlertModal/AlertContext";
import { useAuthContext } from "../auth/AuthContext";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import TaskModal from "../components/AddTaskModal/Modal";
import AddColumnModal from "../components/KanbanBoard/AddColumnModal";
import useClickOutside from "../customHooks/useClickOutside";
import useAllUsers from "../auth/users";
import "./general.css";

export default function General() {
  const users = useAllUsers();
  const { currentUser } = useAuthContext();
  const { searchTerm } = useOutletContext();
  const { taskId } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldExpand = searchParams.get("expanded") == "true";

  const {
    data: tasks,
    add: addTask,
    addWithCustomId,
    update: updateTask,
    batchUpdate,
  } = useFirestoreCollection("tasks", currentUser?.id, true);

  const {
    data: columns,
    add: addColumn,
    update: updateColumn,
  } = useFirestoreCollection("columns", currentUser?.id, true);
  
  const {data : sprints} = useFirestoreCollection("sprints", currentUser?.id, true);

  const [activeAction, setActiveAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("TO DO");
  const [filterUserId, setFilterUserId] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [initialExpanded, setInitialExpanded] = useState(false);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useClickOutside(filterRef, () => setShowFilterMenu(false));
  useClickOutside(sortRef, () => setShowSortMenu(false));

  const isMyTicketsActive = activeAction === "my-tickets";
  const columnColors = ["blue", "yellow", "green", "purple", "red"];

  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [columns]);

  useEffect(() => {
    if (taskId && tasks.length > 0) {
      const foundTask = tasks.find((t) => t.id === taskId);
      if (foundTask) {
        setEditingTask(foundTask);
        setIsModalOpen(true);
        setInitialExpanded(shouldExpand);
      }
    }
  }, [taskId, tasks, shouldExpand]);

  const visibleTasks = useMemo(() => {
    let filtered = tasks.filter((t) => {
      if (!currentUser) return false;
      if(!t.sprintId) return false;
      if (isMyTicketsActive) return t.assignee?.id === currentUser?.id;
      if (filterUserId) return t.assignee?.id === filterUserId;
      return true;
    });

    if (sortOrder) {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      filtered = [...filtered].sort((a, b) => {
        const aValue = priorityOrder[a.priority] || 99;
        const bValue = priorityOrder[b.priority] || 99;
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }, [tasks, currentUser, filterUserId, isMyTicketsActive, sortOrder]);

  const handleActionClick = (action) => {
    if (!currentUser) {
      showAlert("Please Login & Signup for this feature");
      return;
    }

    if (action === "my-tickets") {
      setActiveAction((prev) => (prev === "my-tickets" ? null : "my-tickets"));
    } else {
      setActiveAction(action);
    }

    if (action === "add-task") {
      handleOpenModal();
    }
  };

  const handleMoreClick = () => {
    if (!currentUser || currentUser?.role === "restricted") {
      showAlert("You don't have permission to view this feature. Contact admin.");
      return;
    }
    handleActionClick("more");
    setShowColumnModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleOpenModal = (status = "TO DO") => {
    if (currentUser?.role === "restricted") {
      showAlert("You don't have permission to view this feature. Contact admin.");
      return;
    }
    setEditingTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    if (taskId) navigate("/");
  };

  const handleEditTask = (task) => {
    if (!currentUser) {
      showAlert("Please Login & Signup for this feature");
      return;
    }
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = async (newTask) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, newTask);
        showAlert("Task updated successfully!", "success");
      } else {
        await addWithCustomId(newTask, "Task");
        showAlert("Task created successfully!", "success");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      showAlert("Failed to save task.", "error");
    }
  };

  const handleAddColumn = async (title, position) => {
    const alreadyExists = columns.some(
      (col) => col.title.toLowerCase() === title.toLowerCase().trim()
    );

    if (alreadyExists) {
      showAlert("A column with this name already exists.", "error");
      return;
    }

    let insertPosition =
      position === "start"
        ? 0
        : position === "end" || position == null
        ? columns.length
        : Number(position);

    try {
      if (insertPosition < columns.length) {
        const updates = columns
          .filter((col) => (col.position ?? 0) >= insertPosition)
          .map((col) =>
            updateColumn(col.id, { position: (col.position ?? 0) + 1 })
          );
        await Promise.all(updates);
      }

      await addColumn({
        title: title.trim(),
        color: columnColors[columns.length % columnColors.length],
        position: insertPosition,
        userId: currentUser?.id,
      });

      showAlert("Column added successfully!", "success");
    } catch (error) {
      console.error("Error adding column:", error);
      showAlert("Failed to add column.", "error");
    }
  };

  const handleDeleteColumn = async (columnTitle) => {
    const colToDelete = columns.find((col) => col.title === columnTitle);
    if (!colToDelete) return;

    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "columns", colToDelete.id));

      tasks
        .filter((t) => t.status === columnTitle)
        .forEach((task) => batch.delete(doc(db, "tasks", task.id)));

      await batch.commit();
      showAlert("Column deleted!", "success");
    } catch (error) {
      console.error("Delete failure:", error);
      showAlert("Failed to delete column.", "error");
    }
  };

  return (
    <div className="general-page">
      <div className={`general-content ${!currentUser ? "blurred" : ""}`}>
        <div className="general-header">
          <h1 className="main-heading">General</h1>

          <button
            className="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <HiOutlineAdjustments />
            <span>Actions & Filters</span>
            <HiChevronDown />
          </button>

          <div
            className={`general-actions-wrapper ${
              isMobileMenuOpen ? "mobile-drawer-active" : ""
            }`}
          >
            <div className="mobile-drawer-header">
              <span>Actions & Controls</span>
              <button
                className="close-drawer-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HiX />
              </button>
            </div>

            <div className="general-actions">
              <button
                className={`action-btn ${
                  activeAction === "add-task" ? "active" : ""
                }`}
                onClick={() => handleActionClick("add-task")}
              >
                <HiPlus />
                <span>Add task</span>
              </button>

              <button
                className={`action-btn ${
                  activeAction === "my-tickets" ? "active" : ""
                }`}
                onClick={() => {
                  handleActionClick("my-tickets");
                  setIsMobileMenuOpen(false);
                }}
              >
                <HiOutlineUser />
                <span>My Tickets</span>
              </button>

              {currentUser && (
                <div className="filter-wrapper" ref={filterRef}>
                  <button
                    className={`action-btn ${
                      filterUserId ? "active" : ""
                    }`}
                    onClick={() => {
                      handleActionClick("filter");
                      setShowFilterMenu((prev) => !prev);
                    }}
                  >
                    <HiOutlineFilter />
                    <span>
                      {filterUserId
                        ? users.find((u) => u.id === filterUserId)?.name
                        : "Filter"}
                    </span>
                  </button>

                  {showFilterMenu && (
                    <div className="filter-menu">
                      <button
                        className={`filter-option ${
                          filterUserId === null ? "active" : ""
                        }`}
                        onClick={() => {
                          setFilterUserId(null);
                          setShowFilterMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        All Users
                      </button>

                      {users.map((user) => (
                        <button
                          key={user.id}
                          className={`filter-option ${
                            filterUserId === user.id ? "active" : ""
                          }`}
                          onClick={() => {
                            setFilterUserId(user.id);
                            setShowFilterMenu(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <img
                            src={user.avatar}
                            className="option-avatar"
                            alt={user.name}
                          />
                          {user.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentUser && (
                <div className="sort-wrapper" ref={sortRef}>
                  <button
                    className={`action-btn ${sortOrder ? "active" : ""}`}
                    onClick={() => {
                      handleActionClick("sort");
                      setShowSortMenu((prev) => !prev);
                    }}
                  >
                    <HiOutlineSortAscending />
                    <span>
                      {sortOrder
                        ? sortOrder === "asc"
                          ? "Priority: High to Low"
                          : "Priority: Low to High"
                        : "Sort"}
                    </span>
                  </button>

                  {showSortMenu && (
                    <div className="sort-menu">
                      <button
                        className={`sort-option ${
                          sortOrder === null ? "active" : ""
                        }`}
                        onClick={() => {
                          setSortOrder(null);
                          setShowSortMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Default
                      </button>
                      <button
                        className={`sort-option ${
                          sortOrder === "asc" ? "active" : ""
                        }`}
                        onClick={() => {
                          setSortOrder("asc");
                          setShowSortMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Priority: High to Low
                      </button>
                      <button
                        className={`sort-option ${
                          sortOrder === "desc" ? "active" : ""
                        }`}
                        onClick={() => {
                          setSortOrder("desc");
                          setShowSortMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Priority: Low to High
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                className={`action-btn ${
                  activeAction === "more" ? "active" : ""
                }`}
                onClick={handleMoreClick}
              >
                <HiOutlineDotsHorizontal />
                <span className="mobile-only-text">Add Column</span>
              </button>
            </div>
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

        {showColumnModal && (
          <AddColumnModal
            onClose={() => setShowColumnModal(false)}
            onAdd={handleAddColumn}
            columns={sortedColumns}
          />
        )}

        {isModalOpen && (
          <TaskModal
            onClose={handleModalClose}
            onSave={handleAddTask}
            defaultStatus={defaultStatus}
            editingTask={editingTask}
            columns={columns}
            sprints={sprints}
            initialExpanded={initialExpanded}
          />
        )}
      </div>
    </div>
  );
}