import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth }) => {
  if (!isOpen) return null;

    const width = maxWidth ? maxWidth : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-[#242424] rounded-lg shadow-lg w-full p-6 relative ${width}`}>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 hover:bg-red-500 px-2 rounded-lg"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;