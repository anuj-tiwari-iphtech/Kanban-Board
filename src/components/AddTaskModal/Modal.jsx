import {
    HiOutlineArrowsExpand,
    HiOutlineDotsHorizontal,
    HiOutlineX,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineStar,
    HiPlus,
} from "react-icons/hi";
import { BsCircle } from "react-icons/bs";
import './Modal.css'
import { useState } from "react";
import AttachmentSection from "./AttachmentSection";
import DescriptionSection from "./Description";
import img from '../../assets/navbar.png'

const availableLabels = [
    "Design",
    "Frontend",
    "Backend",
    "Bug",
    "Feature",
];

const priorityOptions = [
    "High",
    "Medium",
    "Low",
];

const statusOptions = [
    "TO DO",
    "IN PROGRESS",
    "REVIEW",
    "DONE",
];

export default function TaskModal({onClose, onSave}) {
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [status, setStatus] = useState("TO DO"); 
    const [taskName, setTaskName] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const [labels, setLabels] = useState([])
    const [showLabels, setShowLabels] = useState(false)
    const [priority, setPriority] = useState("Medium");
    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    
    
    const handleSave = () => {
        const imageFile = attachedFiles.find(
            (file) => file.type.startsWith("image/")
        );
        const newTask = {
            id: Date.now(),
            name: taskName || "Untitled",
            status,
            priority: "Medium",
            labels,
            dueDate: "Aug 20",
            attachmentsCount: attachedFiles.length,
            commentsCount: 2,
            assignee: img,
            image: imageFile
            ? URL.createObjectURL(imageFile)
            : null,
        };
        console.log("Saving task:", newTask);
        onSave(newTask);
      };

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

            <div className="modal-property-row">
                <HiOutlineTag className="property-icon"/>
                <span className="modal-property-label">Label</span>
                <button 
                    className="modal-add-btn"
                    onClick={() => setShowLabels((prev) => !prev)}
                ><HiPlus/> Add label</button>
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

            <div className="modal-property-row">
                <HiOutlineCalendar className="property-icon"/>
                <span className="modal-property-label">Due Date</span>
                <button className="modal-add-btn"><HiPlus/> Add date</button>
            </div>

            <div className="modal-property-row">
                <HiOutlineStar className="property-icon"/>
                <span className="modal-property-label">Priority</span>
                <button className="modal-add-btn"
                    onClick={() => setShowPriority((prev) => !prev)}
                ><HiPlus/> Add priority</button>
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

            <div className="modal-property-row">
                <BsCircle className="property-icon"/>
                <span className="modal-property-label">Status</span>
                <button className="modal-add-btn"
                    onClick={() => setShowStatus((prev) => !prev)}
                ><HiPlus/> Add status</button>
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
            
            <div className="modal-add-more">
            <button className="add-more-btn">
                <HiPlus/> Add More properties
            </button>
            </div>

            <AttachmentSection files={attachedFiles} setFiles={setAttachedFiles} />
            <DescriptionSection/>

            <div className="comment-section">
                <img
                    src={img}
                    alt='user avatar'
                    className="comment-avatar"
                />
                <input
                    type="text"
                    className="comment-input"
                    placeholder="Add a comment..."
                />
            </div>

            <button className="save-btn" onClick={handleSave}>
                Save
            </button>
        </div>

    </div>
  )
}