const TextContent = () => {
  return (
    <>
      <button type="button" className="add-txtbox-btn">
        Add a text box
      </button>
      <h4 className="default-txt-styles">Default text styles</h4>
      <div className="heading-btns-container">
        <button type="button" className="h1">
          Add a heading
        </button>
        <button type="button" className="h3">
          Add a subheading
        </button>
        <button type="button" className="h6">
          Add a little bit of body text
        </button>
      </div>
    </>
  );
};

export default TextContent;
