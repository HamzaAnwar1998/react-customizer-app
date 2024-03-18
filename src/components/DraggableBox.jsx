/* eslint-disable react/prop-types */
import { isBlurhashValid } from "blurhash";
import { Blurhash } from "react-blurhash";
import { useDrag } from "react-dnd";

const DraggableBox = ({ image, index, loadedImages }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "object",
    item: image,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const validRes = isBlurhashValid(image.blur_hash);

  return (
    <div className="box">
      {loadedImages[index] ? (
        <div
          className="drag-box"
          ref={drag}
          style={{
            border: isDragging ? "3px solid #8b3dff" : "0px",
            opacity: isDragging ? 0.5 : 1,
            cursor: "grab",
          }}
        >
          <img src={image.urls.regular} alt={image.alt_description} />
        </div>
      ) : (
        <>
          {validRes.result ? (
            <Blurhash
              hash={image.blur_hash}
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          ) : (
            <div style={{ width: "100%", height: "100%" }}></div>
          )}
        </>
      )}
    </div>
  );
};

export default DraggableBox;
