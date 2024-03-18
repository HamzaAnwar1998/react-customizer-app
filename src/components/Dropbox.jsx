/* eslint-disable react/prop-types */
import tshirt from "../assets/tshirt.png";
import mug from "../assets/mug.png";
import { useDrop } from "react-dnd";

const Dropbox = ({ userChoiceToCustomize, droppedImage, setDroppedImage }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "object",
      drop: (item) => dropImage(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  const dropImage = (item) => {
    setDroppedImage(item);
  };

  return (
    <div className="main-img-div" ref={drop}>
      <img
        src={userChoiceToCustomize === "T-Shirt" ? tshirt : mug}
        alt={userChoiceToCustomize === "T-Shirt" ? "tshirt" : "mug"}
      />
      <div
        className={`drop-div ${
          userChoiceToCustomize === "T-Shirt" ? "tshirt" : "mug"
        }`}
        style={{ border: isOver ? "3px solid #6db5e7" : "0px" }}
      >
        {droppedImage && (
          <img
            src={droppedImage.urls.regular}
            alt={droppedImage.alt_description}
          />
        )}
      </div>
    </div>
  );
};

export default Dropbox;
