import { useState } from "react";
import { HiX } from "react-icons/hi";

export default function CreateSprintModal({onClose, onCreate}) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("")

    const handleSubmit = () => {
        if( !name.trim() || !startDate || !endDate) return;
        onCreate(name.trim(), startDate, endDate);
    }
  return (
    <>
        <div className="column-modal-overlay" onClick={onClose}>
            <div className="column-modal" onClick={(e) => e.stopPropagation()}>
                <div className="column-modal-header">
                    <h3>Create Sprint</h3>
                    <HiX className="column-modal-close" onClick={onClose}/>
                </div>

                <label className="column-modal-label">Sprint Name</label>
                <input
                    type="text"
                    className="column-modal-input"
                    placeholder="e.g. Sprint 1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />

                <label className="column-modal-label">Start Date</label>
                <input
                    type="date"
                    className="column-modal-input"
                    value={startDate}
                    onChange={(e)=> {
                        setStartDate(e.target.value);
                        if( endDate && endDate < e.target.value){
                            setEndDate("")
                        }
                    }}
                />

                <label className="column-modal-label">End Date</label>
                <input
                    type="date"
                    className="column-modal-input"
                    value={endDate}
                    min={startDate}
                    onChange={(e)=> setEndDate(e.target.value)}
                />

                <div className="column-modal-actions">
                    <button className="column-modal-cancel" onClick={onClose}>Cancel</button>
                    <button className="column-modal-confirm" onClick={handleSubmit}>Create</button>
                </div>
            </div>
        </div>
    </>
  )
}