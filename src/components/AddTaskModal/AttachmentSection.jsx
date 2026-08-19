import { useState, useRef } from "react";
import { validateFiles, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from "../../utils/fileValidation";

export default function AttachmentSection({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLEave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const addFiles = (incomingFiles) => {
    setFileError("");
    const { valid, accepted, errors } = validateFiles(incomingFiles, files);

    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
    }
    if (!valid) {
      setFileError(errors.join(" "));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleBrowserClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
    e.target.value = ""; // allow re-selecting the same file after a fix
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  };

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
                  <img src={previewUrl} alt={file.name} className="file-preview-img" />
                ) : (
                  <span className="file-icon">📄</span>
                )}
                <span className="file-name">image</span>
                <button 
                  type="button"
                  className="file-remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {fileError && <p className="login-field-error">{fileError}</p>}

      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLEave}
        onDrop={handleDrop}
      >
        <p className="dropzone-text">Drag & drop your files here</p>
        <p className="dropzone-or">OR</p>

        <button type="button" className="browse-btn" onClick={handleBrowserClick}>
          Browse files
        </button>
        <p className="dropzone-hint">
          {/* {ALLOWED_FILE_TYPES.map((t) => t.split("/")[1]).join(", ")} · up to{" "} */}
          {/* {MAX_FILE_SIZE / 1024}KB each · max {MAX_FILES} files */}
        </p>

        <input
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}