import React, { useState } from "react";
import axios from "axios";

function Document({ doc, handleSetParentId, children, setChildren }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addSubDocument = () => {
    axios
      .post("http://localhost:5000/api/docs", {
        title,
        content,
        parentId: doc._id,
      })
      .then((response) => {
        setChildren([...children, response.data]);
        setTitle("");
        setContent("");
        setShowForm(false);
      });
  };

  const ConvertStringToHtml = (content) => {
    // Parse the JSON string into an object
    const blocks = JSON.parse(content);

    // Convert the blocks to HTML
    const htmlContent = blocks
      .map((block) => {
        switch (block.type) {
          case "paragraph":
            return `<p>${block.data.text}</p>`;
          case "header":
            return `<h${block?.data?.level}>${block.data.text}</h${block?.data?.level}>`;
          case "list":
            const listTag = block.data.style === "ordered" ? "ol" : "ul";
            const listItems = block.data.items
              .map((item) => `<li>${item}</li>`)
              .join("");
            return `<${listTag}>${listItems}</${listTag}>`;
          default:
            return "";
        }
      })
      .join(""); // Join the array of HTML strings into a single string
    return htmlContent;
  };

  return (
    <div style={{ marginLeft: doc.parentId ? "20px" : "0" }}>
      <h2>{doc.title}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: ConvertStringToHtml(doc.content) }}
      />
      <button onClick={() => handleSetParentId(doc._id)}>
        {showForm ? "Cancel" : "Add Sub-document"}
      </button>
      {/* {showForm && (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <button onClick={addSubDocument}>Add Sub-document</button>
        </div>
      )} */}
      {children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {children.map((child) => (
            <Document
              key={child._id}
              doc={child}
              handleSetParentId={handleSetParentId}
              children={children}
              setChildren={setChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Document;
