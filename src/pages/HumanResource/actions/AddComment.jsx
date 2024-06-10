import React from "react";
import './Overlay.css'

const AddComment = ({ actionOverlay, setActionOverlay }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h3>Add Comment</h3>
        <form>
          <label>
            Comment:
            <textarea rows="4" />
          </label>
          <button type="submit">Save</button>
          <button onClick={() => setActionOverlay({ visible: false })}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddComment;
