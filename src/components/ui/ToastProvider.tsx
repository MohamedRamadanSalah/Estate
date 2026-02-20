'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '@/stores/useToastStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-success/10 border-success/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div className="toast-container pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`pointer-events-auto mb-2 flex items-center gap-3 px-5 py-3 rounded-xl border ${bgColors[toast.type]} glass-light shadow-xl`}
          >
            {icons[toast.type]}
            <span className="text-sm font-medium text-navy">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="mr-auto text-gray-400 hover:text-navy">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
