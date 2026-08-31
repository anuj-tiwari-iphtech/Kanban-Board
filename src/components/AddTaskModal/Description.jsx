import { useRef, useEffect, useState } from "react";

export default function DescriptionSection({ description, setDescriptiion }) {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState();

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [description]);

  const handleChange = (e) => {
    setDescriptiion(e.target.value);
    adjustHeight();
  };

  return (
    <div className="description-section">
      <h3 className="section-heading">DESCRIPTION</h3>

      <div className={`description-box ${isFocused ? "active" : ""}`}>
      <textarea
        ref={textareaRef}
        className="description-textarea"
        placeholder="Add a more detailed description"
        value={description}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={2}
      />
      </div>
    </div>
  );
}