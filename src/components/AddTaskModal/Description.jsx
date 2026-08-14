import { useState } from "react";

export default function DescriptionSection(){
    const [description, setDescriptiion] = useState()

    const handleChange = (e) => {
        setDescriptiion(e.target.value);

        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}`
    }

    return(
        <div className="description-section">
            <h3 className="section-heading">DESCRIPTION</h3>

            <textarea
                className="description-textarea"
                placeholder="Add a more detailed description"
                value={description}
                onChange={handleChange}
                rows={2}
            />
        </div>
    )
}