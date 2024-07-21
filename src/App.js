import React, { useState, useEffect } from "react";
import axios from "axios";
import Document from "./Document";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";
import Table from "@editorjs/table";
import Embed from "@editorjs/embed";

function App() {
  const [editor, setEditor] = useState(null);
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState("");
  const [parentId, setParentId] = useState("");
  const [content, setContent] = useState("");
  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => {
    const editorInstance = new EditorJS({
      holder: "editor",
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link"],
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        // image: {
        //   class: ImageTool,
        //   config: {
        //     endpoints: {
        //       byFile: "https://file-upload.ajnavidya.com/upload",
        //       byUrl: "https://file-upload.ajnavidya.com/upload",
        //     },
        //   },
        // },
        image: { class: SimpleImage, inlineToolbar: true },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        attaches: {
          class: AttachesTool,
          inlineToolbar: true,
          config: {
            endpoint: "https://file-upload.ajnavidya.com/upload",
          },
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
        },
      },
      onReady: () => {
        setEditor(editorInstance);
      },
    });

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/docs").then((response) => {
      setDocs(response.data);
    });
  }, []);

  const handleSetParentId = (id) => {
    setParentId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createDocument = () => {
    const validParentId = parentId ? parentId : null;

    axios
      .post("http://localhost:5000/api/docs", {
        title,
        content: content,
        parentId: validParentId,
      })
      .then((response) => {
        if (validParentId) {
          setDocs(
            docs.map((doc) =>
              doc._id === validParentId
                ? { ...doc, children: [...doc.children, response.data] }
                : doc
            )
          );
        } else {
          setDocs([...docs, response.data]);
        }
        setTitle("");
        setParentId("");
        editor.clear(); // Clear the editor content
        setShowBtn(false);
      });
  };

  // const saveData = () => {
  //   editor
  //     .save()
  //     .then((outputData) => {
  //       console.log("Article data: ", outputData);
  //     })
  //     .catch((error) => {
  //       console.log("Saving failed: ", error);
  //     });
  // };

  const saveEditorContent = () => {
    if (!editor) return;

    editor
      .save()
      .then((outputData) => {
        // Validate data structure
        if (outputData.blocks && outputData.blocks.length > 0) {
          // axios
          //   .post("http://localhost:5000/api/save-editor-content", {
          //     content: outputData,
          //   })
          //   .then((response) => {
          //     console.log("Content saved successfully:", response);
          //   })
          //   .catch((error) => {
          //     console.error("Error saving content:", error);
          //   });
          let outputDataString = JSON.stringify(outputData.blocks);
          setContent(outputDataString);
          setShowBtn(true);
        } else {
          alert("Please check you content");
          console.error("Invalid data structure:", outputData);
        }
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  return (
    <div>
      <h1>Nested Documentation</h1>{" "}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
        placeholder="Parent ID (optional)"
      />
      {showBtn && <button onClick={createDocument}>Create Document</button>}
      {!showBtn && <button onClick={saveEditorContent}>Save Content</button>}
      <div style={{ height: "500px" }}>
        <div id="editor"></div>
      </div>
      <div>
        {docs.map((doc) => (
          <Document
            key={doc._id}
            doc={doc}
            handleSetParentId={handleSetParentId}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
