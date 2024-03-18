/* eslint-disable react/prop-types */
import Icon from "react-icons-kit";
import { type } from "react-icons-kit/feather/type";
import { upload } from "react-icons-kit/feather/upload";
import { image } from "react-icons-kit/feather/image";

const Sidebar = ({ tab, handleTabChange }) => {
  return (
    <div className="sidebar">
      <div
        className={`sidebox ${tab === "text" ? "active" : ""}`}
        id="text"
        onClick={(e) => handleTabChange(e.currentTarget.id)}
      >
        <div className="icon">
          <Icon icon={type} size={22} />
        </div>
        <h5>Text</h5>
      </div>
      <div
        className={`sidebox ${tab === "image" ? "active" : ""}`}
        id="image"
        onClick={(e) => handleTabChange(e.currentTarget.id)}
      >
        <div className="icon">
          <Icon icon={image} size={22} />
        </div>
        <h5>Image</h5>
      </div>
      <div
        className={`sidebox ${tab === "upload" ? "active" : ""}`}
        id="upload"
        onClick={(e) => handleTabChange(e.currentTarget.id)}
      >
        <div className="icon">
          <Icon icon={upload} size={22} />
        </div>
        <h5>Upload</h5>
      </div>
    </div>
  );
};

export default Sidebar;
