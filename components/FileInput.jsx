"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const FileInput = ({
  name,
  label,
  required = false,
  file,
  onFileChange,
  disabled,
  onFileRemove,
}) => {
  const [previewURL, setPreviewURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewURL(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewURL(null);
    }
  }, [file]);

  const handleChange = (e) => {
    const fileInput = e?.target?.files;
    if (!fileInput || fileInput.length === 0) return;

    const file = fileInput[0];
    const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

    if (file.size > maxFileSize) {
      toast({
        title: "File size limit exceeded",
        description: "Please select a file less than 2MB in size.",
        variant: "destructive",
      });
      return;
    }

    onFileChange(e);
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block">
        {label}
        {required && "*"}
      </label>

      <div className="flex items-center gap-2">
        {file && (
          <div
            className="w-28 h-28 aspect-square cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {file.type.startsWith("image") ? (
              <img
                src={previewURL}
                alt={name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : file.type === "application/pdf" ? (
              <img
                src="/assets/images/pdf-icon.png"
                alt="PDF Thumbnail"
                className="w-full h-full object-cover rounded-md"
              />
            ) : null}
          </div>
        )}

        <div className={!file ? "flex gap-1 items-center" : ""}>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            name={name}
            onChange={handleChange}
            disabled={disabled}
            className="text-transparent w-28"
          />
          {file ? (
            <p>
              <span className="block">Selected File: {file.name}</span>
              <button
                type="button"
                onClick={onFileRemove}
                className="text-sm text-red-500 font-medium"
              >
                Remove
              </button>
            </p>
          ) : (
            <p className={cn({ "text-gray-400": disabled })}>
              {disabled ? "Disabled" : "No file selected"}
            </p>
          )}
        </div>
      </div>

      {/* Modal Preview */}
      {isModalOpen && file && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-md max-w-full sm:max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 sm:right-4 text-xl p-2 bg-gray-200 rounded-full size-7 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            {file.type.startsWith("image") ? (
              <img
                src={previewURL}
                alt="Full Preview"
                className="w-full h-auto rounded-md"
              />
            ) : (
              <div className="w-full h-[50vh] sm:h-[500px] rounded-md overflow-auto">
                <object
                  data={previewURL}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p className="p-4 text-center">
                    Your device does not support inline PDF viewing.
                    <br />
                    <a
                      href={previewURL}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Click here to download the PDF.
                    </a>
                  </p>
                </object>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;
