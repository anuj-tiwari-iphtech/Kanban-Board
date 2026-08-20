import { useState, useRef } from "react";
import {validateFiles,ALLOWED_FILE_TYPES,MAX_FILE_SIZE,MAX_FILES,} from "../../utils/fileValidation";
import { fileToDataUrl } from "../../utils/fileToDataUrl";

export default function AttachmentSection({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const addFiles = async (incomingFiles) => {
    setFileError("");

    const { valid, accepted, errors } = validateFiles(
      incomingFiles,
      files
    );

    if (accepted.length > 0) {
      try {
        const convertedFiles = await Promise.all(
          accepted.map(async (file) => ({
            id: `file_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: await fileToDataUrl(file),
          }))
        );

        setFiles((prev) => [...prev, ...convertedFiles]);
      } catch (error) {
        console.error("Failed to read files:", error);
        setFileError("Could not read one or more files.");
      }
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
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    addFiles(selectedFiles);

    e.target.value = "";
  };

  const handleRemove = (id) => {
    setFiles((prev) =>
      prev.filter((file) => file.id !== id)
    );

    setFileError("");
  };

  return (
    <div className="attachment-section">
      <h3 className="section-heading">ATTACHMENTS</h3>

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file) => {
            const isImage = file.type?.startsWith("image/");

            return (
              <li key={file.id} className="file-item">
                <button
                  type="button"
                  className="file-remove-btn"
                  onClick={() => handleRemove(file.id)}
                >
                  ✕
                </button>
                {isImage ? (
                  <img
                    src={file.data}
                    alt={file.name}
                    className="file-preview-img"
                  />
                ) : (
                  <span className="file-icon">📄</span>
                )}

                <span className="file-name">
                  Image
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {fileError && (
        <p className="login-field-error">
          {fileError}
        </p>
      )}

      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="dropzone-text">
          Drag & drop your files here
        </p>

        <p className="dropzone-or">OR</p>

        <button
          type="button"
          className="browse-btn"
          onClick={handleBrowserClick}
        >
          Browse files
        </button>

        <p className="dropzone-hint"></p>

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