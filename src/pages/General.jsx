import { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineDotsHorizontal,
  HiPlus,
} from "react-icons/hi";
import "./general.css";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";

export default function General() {
  const [activeAction, setActiveAction] = useState();

  const handleActionClick = (action) => {
    setActiveAction(action);
  };

  return (
    <div className="general-page">
      <div className="general-header">
        <h1 className="main-heading">General</h1>

        <div className="general-actions">
          <button className="add-task-btn">
            <HiPlus />
            <span>Add task</span>
          </button>

          <button
            className={`header-actions ${
              activeAction === "my-tickets" ? "active" : ""
            }`}
            onClick={() => handleActionClick("my-tickets")}
          >
            <HiOutlineUser />
            <span>My Tickets</span>
          </button>

          <button
            className={`header-actions ${
              activeAction === "filter" ? "active" : ""
            }`}
            onClick={() => handleActionClick("filter")}
          >
            <HiOutlineFilter />
            <span>Filter</span>
          </button>

          <button
            className={`header-actions ${
              activeAction === "sort" ? "active" : ""
            }`}
            onClick={() => handleActionClick("sort")}
          >
            <HiOutlineSortAscending />
            <span>Sort</span>
          </button>

          <button
            className={`more-btn ${
              activeAction === "more" ? "active" : ""
            }`}
            onClick={() => handleActionClick("more")}
          >
            <HiOutlineDotsHorizontal />
          </button>
        </div>
      </div>
      <KanbanBoard/>
    </div>
  );
}