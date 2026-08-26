import { useState, useRef, useEffect } from "react";
import {HiOutlineArrowsExpand,HiOutlineDotsHorizontal,HiOutlineX,HiOutlineTag,HiOutlineCalendar,HiOutlineStar,HiPlus, HiOutlineThumbUp, 
    HiOutlineUser, HiThumbUp, HiOutlineClock, HiOutlineBookmark} from "react-icons/hi";
import { BsCircle } from "react-icons/bs";
import AttachmentSection from "./AttachmentSection";
import DescriptionSection from "./Description";
import useClickOutside from "../../customHooks/useClickOutside";
import { priorityConfig } from "../KanbanBoard/TaskCard";
import img from "../../assets/avatar2.png";
import './Modal.css';
import { useAuthContext } from "../../auth/AuthContext";
import useAllUsers from "../../auth/users";

const availableLabels = [
    { name: "Design", color: "#8b5cf6", bg: "#f3e8ff" },
    { name: "Frontend", color: "#0ea5e9", bg: "#e0f2fe" },
    { name: "Backend", color: "#16a34a", bg: "#dcfce7" },
    { name: "Bug", color: "#e5484d", bg: "#fee2e2" },
    { name: "Feature", color: "#f59e0b", bg: "#fef3c7" },
];

const priorityOptions = ["High", "Medium", "Low"];

const colorHexMap = {
    blue: "#159bd7",
    yellow: "#e99c00",
    green: "#16a34a",
    purple: "#8b5cf6",
    red: "#e5484d",
};

export default function TaskModal({ onClose, onSave, defaultStatus, editingTask, columns }) {
    const { currentUser } = useAuthContext();

    const users = useAllUsers();

    // Status options from columns
    const statusOptions = columns?.map((column) => column.title) || [];
    const initialStatus = editingTask?.status && statusOptions.includes(editingTask.status)
        ? editingTask.status
        : defaultStatus && statusOptions.includes(defaultStatus)
        ? defaultStatus
        : statusOptions[0] || "";

    // State
    const [attachedFiles, setAttachedFiles] = useState(editingTask?.attachments || []);
    const [status, setStatus] = useState(initialStatus);
    const [taskName, setTaskName] = useState(editingTask?.name || "");
    const [isExpanded, setIsExpanded] = useState(false);
    const [labels, setLabels] = useState(editingTask?.labels || []);
    const [showLabels, setShowLabels] = useState(false);
    const [priority, setPriority] = useState(editingTask?.priority || "Low");
    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [dueDate, setDueDate] = useState(editingTask?.dueDate || "");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [description, setDescription] = useState(editingTask?.description || "");
    const [comments, setComments] = useState(editingTask?.comments || []);
    const [commentInput, setCommentInput] = useState("");
    const [visibleProperties, setVisibleProperties] = useState(() => {
        const props = [];
        if (editingTask?.assignee) props.push("assignee");
        if (editingTask?.isScheduled) props.push("scheduled");
        if (editingTask?.isBookmarked) props.push("bookmark");
        return props;
    });
    const [showAddPropertyMenu, setShowAddPropertyMenu] = useState(false);
    const [assignee, setAssignee] = useState(editingTask?.assignee || null);
    const [showAssignee, setShowAssignee] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [isScheduled, setIsScheduled] = useState(editingTask?.isScheduled || false);
    const [isBookmarked, setIsBookmarked] = useState(editingTask?.isBookmarked || false);

    // Refs
    const labelMenuRef = useRef(null);
    const priorityRef = useRef(null);
    const statusRef = useRef(null);
    const dateRef = useRef(null);
    const addPropertyRef = useRef(null);
    const assigneeRef = useRef(null);

    // Click outside handlers
    useClickOutside(labelMenuRef, () => setShowLabels(false));
    useClickOutside(priorityRef, () => setShowPriority(false));
    useClickOutside(statusRef, () => setShowStatus(false));
    useClickOutside(dateRef, () => setShowDatePicker(false));
    useClickOutside(addPropertyRef, () => setShowAddPropertyMenu(false));
    useClickOutside(assigneeRef, () => setShowAssignee(false));

    // Handle save
    const handleSave = () => {
        const missingFields = [];

        if (!taskName.trim()) missingFields.push("Task Name");
        if (labels.length === 0) missingFields.push("Label");
        if (!dueDate) missingFields.push("Due Date");
        if (!priority) missingFields.push("Priority");
        if (!status) missingFields.push("Status");

        if (missingFields.length > 0) {
            setValidationError(`Please fill: ${missingFields.join(", ")}`);
            return;
        }

        setValidationError("");

        const newTask = {
            name: taskName || "Untitled",
            status,
            priority,
            labels,
            dueDate: dueDate || "No due Date",
            attachmentsCount: attachedFiles.length,
            commentsCount: comments.length,
            description,
            comments,
            assignee: assignee || null, 
            isScheduled,
            isBookmarked,
            attachments: attachedFiles,
           
            updatedAt: new Date().toISOString(),
            ...(editingTask ? {} : { createdAt: new Date().toISOString() }),
        };

        console.log("Saving task:", newTask);
        onSave(newTask);
    };

    const handleAddComment = () => {
        if (commentInput.trim() === "") return;

        const newComment = {
            id: Date.now(),
            name: currentUser?.name || "You",
            avatar: currentUser?.avatar || img,
            text: commentInput.trim(),
            time: new Date().toLocaleDateString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
            likes: 0,
            liked: false,
        };
        setComments((prev) => [...prev, newComment]);
        setCommentInput("");
    };

    // Extra Properties
    const allExtraProperties = [
        { key: "assignee", label: "Assignee" },
        { key: "scheduled", label: "Today's Scheduled" },
        { key: "bookmark", label: "Bookmark" }
    ];

    const handleAddProperty = (key) => {
        setVisibleProperties((prev) => [...prev, key]);
        setShowAddPropertyMenu(false);
    };

    const handleLikeToggle = (commentId) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === commentId
                    ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                    : c
            )
        );
    };

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const selectedColumn = columns?.find((column) => column.title === status);

    return (
        <div className={`modal-overlay ${isExpanded ? "expanded" : ""}`} onClick={onClose}>
            <div 
                className={`task-modal ${isExpanded ? "expanded" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`task-wrap ${isExpanded ? "expanded" : ""}`}>
                    <div className="modal-icon-row">
                        {isExpanded ? (
                            <>
                                <button className="modal-cancel-btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="modal-save-btn-top" onClick={handleSave}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <HiOutlineArrowsExpand 
                                    className="modal-icon-left"
                                    onClick={() => setIsExpanded((prev) => !prev)}
                                />
                                <div className="modal-icon-right">
                                    <HiOutlineDotsHorizontal />
                                    <HiOutlineX onClick={onClose} />
                                </div>
                            </>
                        )}
                    </div>

                    <p className="modal-breadcrumb">General</p>
                    
                    <input 
                        type="text"
                        className="modal-title-input"
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />

                    <div className="modal-property-row" ref={labelMenuRef}>
                        <HiOutlineTag className="property-icon" />
                        <span className="modal-property-label">Label</span>
                        <button 
                            className={`modal-add-btn ${labels.length > 0 ? "has-labels" : ""}`}
                            onClick={() => setShowLabels((prev) => !prev)}
                        >
                            {labels.length > 0 ? (
                                <div className="selected-labels-row">
                                    {labels.map((label) => (
                                        <span
                                            key={label.name}
                                            className="selected-label-pill"
                                            style={{ color: label.color, backgroundColor: label.bg }}
                                        >
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <><HiPlus /> Add label</>
                            )}
                        </button>
                        {showLabels && (
                            <div className="label-menu">
                                {availableLabels.map((label) => (
                                    <button
                                        key={label.name}
                                        className={`label-option ${labels.some(l => l.name === label.name) ? "active" : ""}`}
                                        onClick={() => {
                                            setLabels((prev) =>
                                                prev.some((item) => item.name === label.name)
                                                    ? prev.filter((item) => item.name !== label.name)
                                                    : [...prev, label]
                                            );
                                        }}
                                    >
                                        {label.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-property-row" ref={dateRef}>
                        <HiOutlineCalendar className="property-icon" />
                        <span className="modal-property-label">Due Date</span>
                        <button 
                            className="modal-add-btn"
                            onClick={() => setShowDatePicker((prev) => !prev)}
                        >
                            {dueDate ? (
                                <span className="selected-value">{dueDate}</span>
                            ) : (
                                <><HiPlus /> Add date</>
                            )}
                        </button>
                        {showDatePicker && (
                            <div className="property-menu date-menu">
                                <input
                                    type="date"
                                    className="date-input"
                                    min={todayString}
                                    onChange={(e) => {
                                        if (!e.target.value) return;
                                        const formatted = new Date(e.target.value + "T00:00:00").toLocaleDateString("en-US", {
                                            month: "numeric",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                        setDueDate(formatted);
                                        setShowDatePicker(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="modal-property-row" ref={priorityRef}>
                        <HiOutlineStar className="property-icon" />
                        <span className="modal-property-label">Priority</span>
                        <button 
                            className="modal-add-btn"
                            onClick={() => setShowPriority((prev) => !prev)}
                        >
                            {priority ? (
                                <span className="selected-value" style={{ color: priorityConfig[priority]?.color || "#000" }}>
                                    {priority}
                                </span>
                            ) : (
                                <><HiPlus /> Add priority</>
                            )}
                        </button>
                        {showPriority && (
                            <div className="label-menu">
                                {priorityOptions.map((item) => (
                                    <button
                                        key={item}
                                        className={`label-option ${priority === item ? "active" : ""}`}
                                        onClick={() => {
                                            setPriority(item);
                                            setShowPriority(false);
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-property-row" ref={statusRef}>
                        <BsCircle className="property-icon" />
                        <span className="modal-property-label">Status</span>
                        <button 
                            className="modal-add-btn"
                            onClick={() => setShowStatus((prev) => !prev)}
                        >
                            {status ? (
                                <span className={`selected-value ${selectedColumn?.color || ""}`}>
                                    {status}
                                </span>
                            ) : (
                                <><HiPlus /> Add Status</>
                            )}
                        </button>
                        {showStatus && (
                            <div className="label-menu">
                                {statusOptions.map((item) => (
                                    <button
                                        key={item}
                                        className={`label-option ${status === item ? "active" : ""}`}
                                        onClick={() => {
                                            setStatus(item);
                                            setShowStatus(false);
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {visibleProperties.includes("assignee") && (
                        <div className="modal-property-row" ref={assigneeRef}>
                            <HiOutlineUser className="property-icon" />
                            <span className="modal-property-label">Assignee</span>
                            <button 
                                className="modal-add-btn"
                                onClick={() => setShowAssignee((prev) => !prev)}
                            >
                                {assignee ? (
                                    <span className="selected-value">{assignee.name}</span>
                                ) : (
                                    <><HiPlus /> Add assignee</>
                                )}
                            </button>
                            {showAssignee && (
                                <div className="property-menu">
                                    {users && users.length > 0 ? (
                                        users.map((user) => (
                                            <button
                                                key={user.id}
                                                className={`property-option ${assignee?.id === user.id ? "active" : ""}`}
                                                onClick={() => {
                                                    setAssignee(user);
                                                    setShowAssignee(false);
                                                }}
                                            >
                                                <img className="navbar-profile" src={user.avatar || img} alt={user.name} />
                                                {user.name}
                                                {user.isDemo && <span className="demo-badge">Demo</span>}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="no-users-text">No users available</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {visibleProperties.includes("scheduled") && (
                        <div className="modal-property-row">
                            <HiOutlineClock className="property-icon" />
                            <span className="modal-property-label">Scheduled</span>
                            <button 
                                className={`modal-add-btn ${isScheduled ? "has-labels" : ""}`}
                                onClick={() => setIsScheduled((prev) => !prev)}
                            >
                                {isScheduled ? (
                                    <span className="selected-value" style={{ color: "#e5484d" }}>
                                        Today's Scheduled
                                    </span>
                                ) : (
                                    <><HiPlus /> Mark as Today's Scheduled</>
                                )}
                            </button>
                        </div>
                    )}

                    {visibleProperties.includes("bookmark") && (
                        <div className="modal-property-row">
                            <HiOutlineBookmark className="property-icon" />
                            <span className="modal-property-label">Bookmark</span>
                            <button
                                className={`modal-add-btn ${isBookmarked ? "has-labels" : ""}`}
                                onClick={() => setIsBookmarked((prev) => !prev)}
                            >
                                {isBookmarked ? (
                                    <span className="selected-value" style={{ color: "#16a34a" }}>
                                        Bookmarked
                                    </span>
                                ) : (
                                    <><HiPlus /> Add bookmark</>
                                )}
                            </button>
                        </div>
                    )}

                    <div className="modal-add-more" ref={addPropertyRef}>
                        <button 
                            className="add-more-btn"
                            onClick={() => setShowAddPropertyMenu((prev) => !prev)}
                        >
                            <HiPlus /> Add More properties
                        </button>
                        {showAddPropertyMenu && (
                            <div className="property-menu">
                                {allExtraProperties
                                    .filter((prop) => !visibleProperties.includes(prop.key))
                                    .map((prop) => (
                                        <button
                                            key={prop.key}
                                            className="property-option"
                                            onClick={() => handleAddProperty(prop.key)}
                                        >
                                            {prop.label}
                                        </button>
                                    ))}
                                {allExtraProperties.every((prop) => visibleProperties.includes(prop.key)) && (
                                    <p className="no-more-properties">No more Properties</p>
                                )}
                            </div>
                        )}
                    </div>

                    <AttachmentSection files={attachedFiles} setFiles={setAttachedFiles} />
                    <DescriptionSection description={description} setDescriptiion={setDescription} />

                    <div className="comment-section">
                        <div className="comment-header">
                            <img
                                src={currentUser?.avatar || img}
                                alt={currentUser?.name || 'user avatar'}
                                className="comment-avatar"
                            />
                            <input
                                type="text"
                                className="comment-input"
                                placeholder="Add a comment..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddComment();
                                }}
                            />
                        </div>

                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <img src={comment.avatar} alt={comment.name} className="comment-avatar" />
                                <div className="comment-body">
                                    <div className="comment-meta">
                                        <span className="comment-name">{comment.name}</span>
                                        <span className="comment-time">{comment.time}</span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                    <div className="comment-actions">
                                        <button
                                            className={`comment-action-btn ${comment.liked ? "liked" : ""}`}
                                            onClick={() => handleLikeToggle(comment.id)}
                                        >
                                            {comment.liked ? <HiThumbUp /> : <HiOutlineThumbUp />}
                                            {comment.likes > 0 ? ` (${comment.likes})` : ""}
                                        </button>
                                        <button className="comment-action-btn">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {validationError && (
                        <p className="validation-error">{validationError}</p>
                    )}

                    {!isExpanded && (
                        <button className="save-btn" onClick={handleSave}>
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}