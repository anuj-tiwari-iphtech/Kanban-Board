import { useState, useRef } from "react"

export default function AttachmentSection({files, setFiles}) {
    // const[files, setFiles] = useState([]);
    const[isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLEave = (e) => {
        e.preventDefault();
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles])
    }

    const handleBrowserClick = () => {
        fileInputRef.current.click()
    }

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        setFiles((prev) => [...prev, ...selectedFiles])
    }

  return (
    <div className="attachment-section">
        <h3 className="section-heading">ATTACHMENTS</h3>

        {files.length > 0 && (
        <ul className="file-list">
        {files.map((file, index) => {
        const isImage = file.type.startsWith("image/");
        const previewUrl = isImage ? URL.createObjectURL(file) : null;

        return (
                <li key={index} className="file-item">
                {isImage ? (
                    <img
                    src={previewUrl}
                    alt={file.name}
                    className="file-preview-img"
                    />
                ) : (
                    <span className="file-icon">📄</span>
                )}
                <span className="file-name">{file.name}</span>
                </li>
            );
            })}
        </ul>
        )}

        <div
            className={`dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLEave}
            onDrop={handleDrop}
        >
            <p className="dropzone-text">Drag & drop your files here</p>
            <p className="dropzone-or">OR</p>

            <button className="browse-btn" onClick={handleBrowserClick}>
                Browser files
            </button>

            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{display: "none"}}
            />
        </div>

        
    </div>
  )
}