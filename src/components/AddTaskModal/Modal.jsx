import { useState, useRef, useEffect } from "react";
import {HiOutlineArrowsExpand,HiOutlineDotsHorizontal,HiOutlineX,HiOutlineTag,HiOutlineCalendar,HiOutlineStar,HiPlus, HiOutlineThumbUp, HiOutlineUser} from "react-icons/hi";
import { BsCircle } from "react-icons/bs";
import AttachmentSection from "./AttachmentSection";
import DescriptionSection from "./Description";
import useClickOutside from "../customHooks/useClickOutside";
import img from '../../assets/navbar.png'
import './Modal.css'

const availableUsers = [
    { id: 1, name: "Marilyn", avatar: img },
    { id: 2, name: "Alex", avatar: img },
    { id: 3, name: "Priya", avatar: img },
];

const availableLabels = ["Design","Frontend","Backend","Bug","Feature",];

const priorityOptions = [
    "High",
    "Medium",
    "Low",
];

const statusOptions = ["TO DO","IN PROGRESS","REVIEW","DONE",];

export default function TaskModal({onClose, onSave, defaultStatus}) {
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [status, setStatus] = useState(defaultStatus || "TO DO"); 
    const [taskName, setTaskName] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const [labels, setLabels] = useState([])
    const [showLabels, setShowLabels] = useState(false)
    const [priority, setPriority] = useState("");
    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [dueDate, setDueDate] = useState("")
    const [showDatePicker, setShoeDatePicker] = useState(false)
    const [description, setDescriptiion] = useState("")
    const [comments, setComments] = useState([])
    const [commentInput, setCommentInput] = useState("")
    const [visibleProperties, setVisibleProperties] = useState([])
    const [showAddProprtyMenu, setShowAddPropertyMenu] = useState(false)
    const [assignee, setAssignee] = useState(null)
    const [showAssignee, setShowAssignee] = useState(false)
    
    const handleSave = () => {
        const imageFile = attachedFiles.find(
            (file) => file.type.startsWith("image/")
        );
        const newTask = {
            id: Date.now(),
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
            image: imageFile
            ? URL.createObjectURL(imageFile)
            : null,
        };
        console.log("Saving task:", newTask);
        onSave(newTask);
      };

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

      const handleAddComment = () => {
        if(commentInput.trim() === "") return;
        
        const newComment = {
            id : Date.now(),
            name : "You",
            avatar: img,
            text: commentInput.trim(),
            time: new Date().toLocaleDateString("en-US", {
                hour:"numeric",
                minute: "2-digit",
                hour12: true,
            })
        }

        setComments((prev) => [...prev, newComment])
        setCommentInput("")
      }

      const allExtraProperties = [
        {key: "assignee", label: "Assignee"}
      ]

      const handleAddProperty = (key) => {
        setVisibleProperties((prev) => [...prev, key])
        setShowAddPropertyMenu(false)
      }

  return (
    <div className={`modal-overlay ${isExpanded ? "expanded" : ""}`} onClick={onClose}>
        <div className={`task-modal ${isExpanded ? "expanded" : ""}`}
         onClick={(e) => e.stopPropagation()}>

            <div className="modal-icon-row">
                <HiOutlineArrowsExpand 
                    className="modal-icon-left"
                    onClick={() => setIsExpanded((prev) => !prev)}
                />
                <div className="modal-icon-right">
                    <HiOutlineDotsHorizontal/>
                    <HiOutlineX onClick={onClose}/>
                </div>
            </div>

            <p className="modal-breadcrumb">General</p>
            <h2 className="modal-title">Task Name</h2>

            <div className="modal-property-row" ref={labelMenuRef}>
                <HiOutlineTag className="property-icon"/>
                <span className="modal-property-label">Label</span>
                <button 
                    className="modal-add-btn"
                    onClick={() => setShowLabels((prev) => !prev)}
                >
                {labels.length > 0 ? (
                    <span className="selected-value">{labels.join(",")}</span>
                ) : (
                    <><HiPlus/> Add label</>
                )}
                </button>
                {showLabels && (
                    <div className="label-menu">
                        {availableLabels.map((label) => (
                            <button
                                key={label}
                                className={`label-option ${labels.includes(label) ? "active":""} `}
                                onClick={() => {
                                    setLabels((prev) => 
                                        prev.includes(label)
                                        ? prev.filter((item) => item !== label)
                                        : [...prev, label]   
                                        )
                                }}
                            >{label}</button>
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
                                onChange={(e) => {
                                    const formatted = new Date(e.target.value).toLocaleDateString("en-Us", {
                                        month: "short",
                                        day : "numeric",
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
                    <span className="selected-value">{priority}</span>
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
                                {/* {priority === item && "✓ "} */}
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
                    <span className="selected-value">{status}</span>
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
                                {/* {status === item && "✓ "} */}
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
                            {availableUsers.map((user) => (
                                <button 
                                    key={user.id}
                                    className={`property-option ${assignee?.id === user.id ? "active":""}`}
                                    onClick={() => {
                                        setAssignee(user)
                                        setShowAssignee(false)
                                    }}
                                >
                                    <img src={user.avatar} alt={user.name}/>{user.name}
                                </button>
                            ))}
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
                    src={img}
                    alt='user avatar'
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
                        <div className="comment-bosy">
                            <div className="comment-meta">
                                <span className="comment-name">{comment.name}</span>
                                <span className="comment-time">{comment.time}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            <div className="comment-actions">
                                <button className="comment-action-btn"><HiOutlineThumbUp/> Like</button>
                                <button className="comment-action-btn">Reply</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="save-btn" onClick={handleSave}>
                Save
            </button>
        </div>

    </div>
  )
}