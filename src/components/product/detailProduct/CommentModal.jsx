// CommentModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import CommentForm from "./CommentForm";

const CommentModal = ({ isOpen, onClose, product, onSuccess }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose}
      ></div>
      <div className="relative z-20">
        <CommentForm 
          setIsShowAddComment={onClose} 
          product={product}
          onSuccess={onSuccess}
        />
      </div>
    </div>,
    document.body
  );
};

export default CommentModal;
