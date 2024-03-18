import { useEffect } from "react";
import { useState } from "react";
import UploadedImageBox from "./UploadedImageBox";

const UploadContent = () => {
  // states
  const [mediaFiles, setMediaFiles] = useState([]);
  const [fileError, setFileError] = useState(null);

  // Load images from local storage on component mount
  useEffect(() => {
    const storedMediaFiles = JSON.parse(localStorage.getItem("mediaFiles"));
    if (storedMediaFiles) {
      setMediaFiles(storedMediaFiles);
    }
  }, []);

  // event
  const handleMediaFile = (file) => {
    const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    const fileType = file.type;
    const maxFileSizeMB = 20; // Maximum file size in MB

    // Check file type
    if (!allowedFileTypes.includes(fileType)) {
      setFileError("Invalid file type. Only PNG, JPEG, and JPG are allowed.");
      return;
    }

    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setFileError(`File size should not exceed ${maxFileSizeMB}MB.`);
      return;
    }

    // Check if file name already exists
    const fileNameExists = mediaFiles.some(
      (mediaFile) => mediaFile.name === file.name
    );
    if (fileNameExists) {
      setFileError("File with the same name already exists.");
      return;
    }

    // File is valid
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const newMediaFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data,
        alt_description: file.name,
        urls: {
          regular: base64Data,
        },
      };
      setMediaFiles((prevMediaFiles) => [...prevMediaFiles, newMediaFile]);
      saveMediaFiles([...mediaFiles, newMediaFile]);
    };
    reader.readAsDataURL(file);
    setFileError(null);

    // Clear input field value
    document.getElementById("file-upload").value = null;
  };

  // save images to the LS
  const saveMediaFiles = (files) => {
    localStorage.setItem("mediaFiles", JSON.stringify(files));
  };

  // delete media
  const deleteMedia = (name) => {
    const updatedMediaFiles = mediaFiles.filter(
      (mediaFile) => mediaFile.name !== name
    );
    setMediaFiles(updatedMediaFiles);
    saveMediaFiles(updatedMediaFiles);
  };

  return (
    <>
      <label className="upload-img-btn">
        Upload Images
        <input
          type="file"
          className="file-upload-input"
          id="file-upload"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleMediaFile(e.target.files[0])}
        />
      </label>
      {fileError && <div className="error-msg">{fileError}</div>}
      <h4 className="default-txt-styles">Recent Uploads</h4>
      {mediaFiles.length > 0 ? (
        <div className="recent-files-container">
          {mediaFiles.map((file) => (
            <UploadedImageBox
              key={file.name}
              file={file}
              deleteMedia={deleteMedia}
            />
          ))}
        </div>
      ) : (
        <div className="error-msg">No Uploads Yet!</div>
      )}
    </>
  );
};

export default UploadContent;
