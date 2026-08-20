import { useState } from "react";
import { HiX } from "react-icons/hi";

import './KanbanBoard.css'

export default function AddColumnModal( {onClose, onAdd, columns}){
    const [title, setTitle] = useState("")
    const [position, setPosition] = useState("end")

    const handleSubmit = () => {
        if(!title.trim()) return;
        onAdd(title.trim(), position);
        onClose();
    }

    return(
        <div className="column-modal-overlay" onClick={onClose}>
            <div className="column-modal" onClick={(e) => e.stopPropagation()}>
                <div className="column-modal-header">
                    <h3>Add New Column</h3>
                    <HiX className="column-modal-close" onClick={onClose}/>
                </div>

                <label className="column-modal-name">Column Name</label>
                <input
                    type="text"
                    className="column-modal-input"
                    placeholder="e.g. Testing, Blocked ..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />

                <label className="column-modal-name">Position</label>
                <select
                    className="column-modal-select"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                >
                    <option value="start">Beginning</option>
                    {columns.map((col, index) => (
                        <option key={index} value={index+1}>
                            After "{col.title}"
                        </option>
                    ))}
                    {/* <option value="start">End</option> */}
                </select>

                <div className="column-modal-actions">
                    <button className="column-modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="column-modal-confirm" onClick={handleSubmit}>
                        Add Column
                    </button>
                </div>
            </div>
        </div>
    )
}