import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
    open = false,                  // controls visibility
    title = "Confirm Action",      // modal title
    message = "Are you sure you want to proceed?", // modal message
    confirmText = "Delete",        // confirm button text
    cancelText = "Cancel",         // cancel button text
    confirmColor = "bg-red-600 hover:bg-red-700", // confirm button color
    icon = <AlertTriangle className="h-6 w-6 text-red-600" />, // default icon
    onCancel = () => { },           // cancel handler
    onConfirm = () => { },          // confirm handler
}) {
    if (!open) return null; // don’t render if closed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            >
                <div className="flex items-center gap-3 mb-4">
                    {icon}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
