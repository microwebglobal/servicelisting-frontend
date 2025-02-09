import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TextEditor = ({ value, onChange, className, ...props }) => {
  const [editorValue, setEditorValue] = useState(value || "");

  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const handleEditorChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
      console.log(content);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
    },
  };

  return (
    <ReactQuill
      value={editorValue}
      onChange={handleEditorChange}
      className={className}
      theme="snow"
      modules={modules}
      {...props}
      style={{ height: "200px", paddingBottom: "40px" }}
    />
  );
};

export default TextEditor;
