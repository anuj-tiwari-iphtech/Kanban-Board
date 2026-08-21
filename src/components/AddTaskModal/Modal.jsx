import { useState, useRef, useEffect } from "react";
import {HiOutlineArrowsExpand,HiOutlineDotsHorizontal,HiOutlineX,HiOutlineTag,HiOutlineCalendar,HiOutlineStar,HiPlus, HiOutlineThumbUp, HiOutlineUser, HiThumbUp} from "react-icons/hi";
import { BsCircle } from "react-icons/bs";
import AttachmentSection from "./AttachmentSection";
import DescriptionSection from "./Description";
import useClickOutside from "../../customHooks/useClickOutside";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { priorityConfig } from "../KanbanBoard/TaskCard";
import img from "../../assets/avatar2.png"
import './Modal.css'


const availableLabels = [
    { name: "Design", color: "#8b5cf6", bg: "#f3e8ff" },
    { name: "Frontend", color: "#0ea5e9", bg: "#e0f2fe" },
    { name: "Backend", color: "#16a34a", bg: "#dcfce7" },
    { name: "Bug", color: "#e5484d", bg: "#fee2e2" },
    { name: "Feature", color: "#f59e0b", bg: "#fef3c7" },
];

const priorityOptions = [
    "High",
    "Medium",
    "Low",
];

const colorHexMap = {
    blue: "#159bd7",
    yellow: "#e99c00",
    green: "#16a34a",
    purple: "#8b5cf6",
    red: "#e5484d",
};



export default function TaskModal({onClose, onSave, defaultStatus, editingTask, columns}) {
    const [users] = useLocalStorage("kanban-users", []); 
    const [currentUser] = useLocalStorage("kanban-current-user", null);

    const statusOptions = columns.map((c) => c.title);
    const statusConfig = columns.reduce((acc, c) => {
        acc[c.title] = { color: colorHexMap[c.color] || "#8b95a7" };
        return acc;
    }, {});

    const [attachedFiles, setAttachedFiles] = useState( editingTask?.attachments || []);
    const [status, setStatus] = useState( editingTask?.status ||defaultStatus || statusOptions[0] || "TO DO")
    const [taskName, setTaskName] = useState( editingTask?.name || "")
    const [isExpanded, setIsExpanded] = useState(false)
    const [labels, setLabels] = useState( editingTask?.labels || [])
    const [showLabels, setShowLabels] = useState(false)
    const [priority, setPriority] = useState( editingTask?.priority || "Low")
    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [dueDate, setDueDate] = useState(editingTask?.dueDate || "")
    const [showDatePicker, setShoeDatePicker] = useState(false)
    const [description, setDescriptiion] = useState(editingTask?.description || "")
    const [comments, setComments] = useState( editingTask?.comments || [])
    const [commentInput, setCommentInput] = useState("")
    const [visibleProperties, setVisibleProperties] = useState(editingTask?.assignee ? ["assignee"] : [])
    const [showAddProprtyMenu, setShowAddPropertyMenu] = useState(false)
    const [assignee, setAssignee] = useState(editingTask?.assignee || null)
    const [showAssignee, setShowAssignee] = useState(false)
    const [validationError, setValidationError] = useState("")

    const labelMenuRef = useRef(null);
    const priorityRef = useRef(null);
    const statusRef = useRef(null);
    const dateRef = useRef(null);
    const addPropertyRef  = useRef(null);
    const assigneeRef = useRef(null);

    useClickOutside(labelMenuRef, () => setShowLabels(false))
    useClickOutside(priorityRef, () => setShowPriority(false))
    useClickOutside(statusRef, () => setShowStatus(false))
    useClickOutside(dateRef, () => setShoeDatePicker(false))
    useClickOutside(addPropertyRef, () => setShowAddPropertyMenu(false))
    useClickOutside(assigneeRef, () => setShowAssignee(false))

    
    const handleSave = () => {

        const missingField = [];

        if(!taskName.trim()) missingField.push("Task Name")
        if(labels.length === 0) missingField.push("Label")
        if(!dueDate) missingField.push("Due Date")
        if(!priority) missingField.push("Priority")
        if(!status) missingField.push("Status")
        if(!assignee) missingField.push("Assignee")

        if (missingField.length > 0) {
            setValidationError(`Please fill: ${missingField.join(", ")}`);
            if (missingField.includes("Assignee") && !visibleProperties.includes("assignee")) {
                setVisibleProperties((prev) => [...prev, "assignee"]);   
            }
            return;
        }
        
        setValidationError("");

        const newTask = {
            id: editingTask?.id || Date.now(),
            name: taskName || "Untitled",
            status,
            priority,
            labels,
            dueDate: dueDate || "No due Date",
            attachmentsCount: attachedFiles.length,
            commentsCount: comments.length,
            description,
            comments,
            assignee: assignee,
            attachments: attachedFiles,
        };
        console.log("Saving task:", newTask);
        onSave(newTask);
    };

    const handleAddComment = () => {
        if(commentInput.trim() === "") return;
    
        const newComment = {
            id : Date.now(),
            name :  currentUser?.name || "You",
            avatar: currentUser?.avatar || img,
            text: commentInput.trim(),
            time: new Date().toLocaleDateString("en-US", {
                hour:"numeric",
                minute: "2-digit",
                hour12: true,
            }),
            likes:0,
            liked:false,
        }
        setComments((prev) => [...prev, newComment])
        setCommentInput("")
    }

    const allExtraProperties = [{key: "assignee", label: "Assignee"}]

    const handleAddProperty = (key) => {
        setVisibleProperties((prev) => [...prev, key])
        setShowAddPropertyMenu(false)
    }

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

  return (
    <div className={`modal-overlay ${isExpanded ? "expanded" : ""}`} onClick={onClose}>
        <div className={`task-modal ${isExpanded ? "expanded" : ""}`}
         onClick={(e) => e.stopPropagation()}>
        <div className={`task-wrap ${isExpanded ? "expanded" : ""}`}>
        <div className="modal-icon-row">
            { isExpanded? (
                <>
                <button className="modal-cancel-btn" onClick={onClose}>
                    Cancel
                </button>
                <button className="modal-save-btn-top" onClick={handleSave}>
                    Save
                </button>
                </>
            ):(
                <>
                <HiOutlineArrowsExpand 
                    className="modal-icon-left"
                    onClick={() => setIsExpanded((prev) => !prev)}
                />
                <div className="modal-icon-right">
                    <HiOutlineDotsHorizontal/>
                    <HiOutlineX onClick={onClose}/>
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
                <HiOutlineTag className="property-icon"/>
                <span className="modal-property-label">Label</span>
                <button 
                    className={`modal-add-btn ${labels.length > 0 ? "has-labels": ""}`}
                    onClick={() => setShowLabels((prev) => !prev)}
                >
                {labels.length > 0 ? (
                    <div className="selected-labels-row">
                        {labels.map((label) => (
                            <span
                                key={label.name}
                                className="selected-label-pill"
                                style={{color: label.color, backgroundColor: label.bg}}
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <><HiPlus/> Add label</>
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
                                    )
                                }}
                            > 
                                {label.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="modal-property-row" ref={dateRef}>
                <HiOutlineCalendar className="property-icon"/>
                <span className="modal-property-label">Due Date</span>
                <button className="modal-add-btn"
                    onClick={() => setShoeDatePicker((prev) => !prev)}
                    >
                    {dueDate ? (
                        <span className="selected-value">{dueDate}</span>
                    ) : (
                        <><HiPlus/> Add date</>
                    )}</button>
                    {showDatePicker && (
                        <div className="property-menu date-menu">
                            <input
                                type="date"
                                className="date-input"
                                min={todayString}
                                onChange={(e) => {
                                    if(!e.target.value) return;
                                    const formatted = new Date(e.target.value + "T00:00:00").toLocaleDateString("en-Us", {
                                        month: "numeric",
                                        day : "numeric",
                                        year : "numeric",
                                    })
                                    setDueDate(formatted)
                                    setShoeDatePicker(false);
                                }}
                            />
                        </div>
                    )}
            </div>

            <div className="modal-property-row" ref={priorityRef}>
                <HiOutlineStar className="property-icon"/>
                <span className="modal-property-label">Priority</span>
                <button className="modal-add-btn"
                    onClick={() => setShowPriority((prev) => !prev)}
                >
                {priority ? (
                    <span className="selected-value" style={{color : priorityConfig[priority].color}}>{priority}</span>
                ):(
                    <><HiPlus/>Add priority</>
                )}
                </button>
                {showPriority && (
                    <div className="label-menu">
                        {priorityOptions.map((item) => (
                            <button
                                key={item}
                                className={`label-option ${
                                    priority === item ? "active" : ""
                                }`}
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
                <BsCircle className="property-icon"/>
                <span className="modal-property-label">Status</span>
                <button className="modal-add-btn"
                    onClick={() => setShowStatus((prev) => !prev)}
                >
                {status ? (
                    <span className="selected-value" style={{color : statusConfig[status].color}}>{status}</span>
                ): (
                    <><HiPlus/>Add Status</>
                )}
                </button>
                {showStatus && (
                <div className="label-menu">
                    {statusOptions.map((item) => (
                            <button
                                key={item}
                                className={`label-option ${
                                    status === item ? "active" : ""
                                }`}
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
                    <HiOutlineUser className="property-icon"/>
                    <span className="modal-property-label">Assignee</span>
                    <button className="modal-add-btn"
                        onClick={() => setShowAssignee((prev) => !prev)}
                    >
                        {assignee ? (
                            <span className="selected-value">{assignee.name}</span>
                        ):(
                            <><HiPlus/> Add assignee</>
                        )}
                    </button>
                    {showAssignee && (
                        <div className="property-menu">
                        {users.length > 0 ?
                            (users.map((user) => (
                                <button 
                                    key={user.id}
                                    className={`property-option ${assignee?.id === user.id ? "active":""}`}
                                    onClick={() => {
                                        setAssignee(user)
                                        setShowAssignee(false)
                                    }}
                                >
                                    <img className="navbar-profile" src={user.avatar}/>
                                    {user.name}
                                    {user.isDemo && <span className="demo-badge">Demo</span>}
                                </button>
                            ))):(
                                <p className="no-users-text">No users signed up yet</p>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            <div className="modal-add-more" ref={addPropertyRef}>
            <button 
                className="add-more-btn"
                onClick={() => setShowAddPropertyMenu((prev) => !prev)}
            >
                <HiPlus/> Add More properties
            </button>
            {showAddProprtyMenu && (
                <div className="property-menu">
                    {allExtraProperties
                    .filter((prop) => !visibleProperties.includes(prop))
                    .map((prop) =>
                        <button
                            key={prop.key}
                            className="property-option"
                            onClick={() => handleAddProperty(prop.key)}
                        >{prop.label}</button>
                    )}

                    {allExtraProperties.every((prop) => visibleProperties.includes(prop.key)) && (
                        <p className="no-more-properties">No more Properties</p>
                    )}
                </div>
            )}
            </div>

            <AttachmentSection files={attachedFiles} setFiles={setAttachedFiles} />
            <DescriptionSection description={description} setDescriptiion={setDescriptiion}/>

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
                            if(e.key === "Enter") handleAddComment();
                        }}
                    />
                </div>

                {comments.map((comment) =>(
                    <div key={comment.id} className="comment-item">
                        <img src={comment.avatar} alt={comment.name} className="comment-avatar"/>
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
                                    {comment.liked ? <HiThumbUp/> : <HiOutlineThumbUp/>}
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

            { !isExpanded &&
                (<button className="save-btn" onClick={handleSave}>
                Save
                </button>)
            }
            
        </div>
        </div>
    </div>
  )
}