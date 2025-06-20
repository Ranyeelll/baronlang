import React from 'react';
import { X } from 'lucide-react';
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}
export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Delete Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{title}"? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
              Cancel
            </button>
            <button onClick={() => {
            onConfirm();
            onClose();
          }} className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>;
};