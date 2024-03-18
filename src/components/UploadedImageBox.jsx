/* eslint-disable react/prop-types */
import { useDrag } from "react-dnd";
import Icon from "react-icons-kit";
import { arrows_circle_remove } from "react-icons-kit/linea/arrows_circle_remove";

const UploadedImageBox = ({ file, deleteMedia }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "object",
    item: file,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className="box-upload">
      <div className="x-btn-div">
        <button
          type="button"
          className="x-btn"
          onClick={() => deleteMedia(file.name)}
        >
          <Icon icon={arrows_circle_remove} size={20} />
        </button>
      </div>
      <div
        className="drag-box-upload"
        ref={drag}
        style={{
          border: isDragging ? "3px solid #8b3dff" : "0px",
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
        }}
      >
        <img src={file.data} alt={file.name} />
      </div>
    </div>
  );
};

export default UploadedImageBox;
