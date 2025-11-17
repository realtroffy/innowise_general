import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, clearError } from "../../../store/slices/gallerySlice.js";
import { galleryValidateUploadForm } from "../galleryValidation.js";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import FileInput from "../../../components/FileInput/FileInput.jsx";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "./UploadImage.css";

export default function UploadImage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const uploading = useSelector((state) => state.gallery.loading);
  const uploadError = useSelector((state) => state.gallery.error);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  if (!user) {
    return null;
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    dispatch(clearError());

    const validation = galleryValidateUploadForm({
      file: uploadFile,
      description: uploadDesc,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    if (!user?.id) {
      setValidationErrors({ general: "User ID is required" });
      return;
    }

    try {
      await dispatch(
        uploadImage({
          userId: user.id,
          file: uploadFile,
          description: uploadDesc,
        })
      ).unwrap();

      setUploadFile(null);
      setUploadDesc("");
      setValidationErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowUploadForm(false);
    } catch (error) {
      console.error("Upload image error:", error);
    }
  };

  const resetForm = () => {
    setUploadFile(null);
    setUploadDesc("");
    setValidationErrors({});
    dispatch(clearError());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!showUploadForm) {
    return (
      <div className="upload-toggle">
        <Button
          variant="primary"
          onClick={() => setShowUploadForm(true)}
          title="Add image"
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <form className="auth-form upload-form" onSubmit={handleUpload}>
      <FileInput
        label="Choose image"
        id="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => {
          setUploadFile(e.target.files[0]);
          if (validationErrors.file) {
            setValidationErrors((prev) => ({ ...prev, file: "" }));
          }
        }}
        error={validationErrors.file}
        required
      />
      <Input
        label="Description"
        type="text"
        id="desc"
        value={uploadDesc}
        onChange={(e) => {
          setUploadDesc(e.target.value);
          if (validationErrors.description) {
            setValidationErrors((prev) => ({ ...prev, description: "" }));
          }
        }}
        placeholder="Short description"
        error={validationErrors.description}
        required
      />
      <ErrorBanner>{uploadError}</ErrorBanner>
      <div className="upload-actions">
        <Button type="submit" variant="primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            setShowUploadForm(false);
            resetForm();
          }}
        >
          Close
        </Button>
      </div>
    </form>
  );
}
