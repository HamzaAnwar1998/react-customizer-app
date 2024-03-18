import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import html2canvas from "html2canvas";
import Sidebar from "./components/Sidebar";
import TextContent from "./components/TextContent";
import DraggableBox from "./components/DraggableBox";
import Dropbox from "./components/Dropbox";
import UploadContent from "./components/UploadContent";

function App() {
  // states
  const [userChoiceToCustomize, setUserChoiceToCustomize] = useState("T-Shirt");
  const [tab, setTab] = useState("image");
  const [droppedImage, setDroppedImage] = useState(null);

  // handle user choice
  const handleUserChoice = () => {
    if (!droppedImage) {
      setUserChoiceToCustomize(
        userChoiceToCustomize === "T-Shirt" ? "Mug" : "T-Shirt"
      );
    } else {
      Swal.fire({
        title: "Do you wish to continue?",
        text: `Switching to ${
          userChoiceToCustomize === "T-Shirt" ? "Mug" : "T-Shirt"
        } will cause you to lose all your current progress.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setUserChoiceToCustomize(
            userChoiceToCustomize === "T-Shirt" ? "Mug" : "T-Shirt"
          );
          setDroppedImage(null);
        }
      });
    }
  };

  // tab change event
  const handleTabChange = (id) => {
    setTab(id);
  };

  // retrieving unsplash images
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get(
        "https://api.unsplash.com/photos/?client_id=dUO_hDITwVMkmHvUD-NX03FybLRXCkzM5VV-_iQTx0c&per_page=15",
        {
          headers: {
            "Accept-Version": "v1",
          },
        }
      )
      .then((res) => {
        setImages(res.data);
        setLoadedImages(Array(res.data.length).fill(false));
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setImages([]);
        setLoadedImages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // the loaded images will be updated in the loadedImages state
  useEffect(() => {
    if (images.length > 0) {
      const loadImage = (index) => {
        const img = new Image();
        img.src = images[index].urls.regular;
        img.onload = () => {
          setLoadedImages((previousImages) =>
            previousImages.map((loaded, i) => (i === index ? true : loaded))
          );
        };
      };
      images.forEach((_, index) => loadImage(index));
    }
  }, [images]);

  // search states
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState(null);

  // handle search with debounce
  const handleSearch = (value) => {
    setQuery(value);
    // clear any existing timer
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      if (value !== "") {
        setLoading(true);
        axios
          .get(
            `https://api.unsplash.com/search/photos/?client_id=dUO_hDITwVMkmHvUD-NX03FybLRXCkzM5VV-_iQTx0c&query=${value}&per_page=15`,
            {
              headers: {
                "Accept-Version": "v1",
              },
            }
          )
          .then((res) => {
            setImages(res.data.results);
            setLoadedImages(Array(res.data.results.length).fill(false));
            setError(null);
          })
          .catch((err) => {
            setError(err.message);
            setImages([]);
            setLoadedImages([]);
          })
          .finally(() => setLoading(false));
      }
    }, 2000);
    setTimer(newTimer);
  };

  // download image
  const downloadableAreaRef = useRef(null);
  const downloadImage = () => {
    const element = downloadableAreaRef.current;
    // Create a canvas with the desired dimensions
    const canvas = document.createElement("canvas");
    canvas.width = userChoiceToCustomize === "T-Shirt" ? 1280 : 820;
    canvas.height = userChoiceToCustomize === "T-Shirt" ? 1024 : 512;

    // Get the 2D context of the canvas
    const ctx = canvas.getContext("2d");

    // Capture the content onto the canvas
    html2canvas(element, { allowTaint: true, useCORS: true }).then(
      (sourceCanvas) => {
        // Draw the captured content onto the new canvas with resizing
        ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL and create a download link
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${userChoiceToCustomize}.png`;
        link.href = imgData;
        link.click();
      }
    );
  };

  return (
    <>
      <h1>ReactJS T-Shirt And Mug Customizer App</h1>
      <div className="container">
        <div className="leftside">
          <Sidebar tab={tab} handleTabChange={handleTabChange} />
          <div className="content">
            {/* text */}
            {tab === "text" && <TextContent />}
            {/* image */}
            {tab === "image" && (
              <>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search For Photos, eg: emojis"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  readOnly={loading}
                />
                {loading ? (
                  <h4>Loading...</h4>
                ) : (
                  <>
                    {error ? (
                      <div className="error-msg">{error}</div>
                    ) : (
                      <>
                        {images.length > 0 ? (
                          <div className="recent-files-container">
                            {images.map((image, index) => (
                              <DraggableBox
                                key={image.id}
                                image={image}
                                index={index}
                                loadedImages={loadedImages}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="error-msg">No Image Found</div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {/* upload */}
            {tab === "upload" && <UploadContent />}
          </div>
        </div>
        <div className="rightside">
          <div className="btns-flex">
            <button
              type="button"
              className="switch-btn"
              onClick={handleUserChoice}
            >
              Switch With{" "}
              {userChoiceToCustomize === "T-Shirt" ? "Mug" : "T-Shirt"}
            </button>
            <button
              type="button"
              className="download-btn"
              onClick={downloadImage}
            >
              Download
            </button>
          </div>
          <div className="downloadable-area" ref={downloadableAreaRef}>
            <Dropbox
              userChoiceToCustomize={userChoiceToCustomize}
              droppedImage={droppedImage}
              setDroppedImage={setDroppedImage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
