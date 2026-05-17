import React, { useState } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface ExemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
}

const ExemptionModal: React.FC<ExemptionModalProps> = ({ isOpen, onClose, courseId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('justification_document', file);

    try {
      await api.post('/courses/' + courseId + '/exemptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Exemption request submitted successfully. Please await admin approval.');
      setTimeout(() => {
        onClose();
        setSuccess('');
        setFile(null);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while submitting the request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1f2e] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-xl font-bold text-white">Prerequisite Exemption Request</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 text-yellow-500">
              <AlertCircle size={24} className="shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">
                This course requires completing prerequisite courses. You can request an exemption by uploading a <b>justification document</b> for admin review.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-500/20 mb-6 text-center">
                {error}
              </div>
            )}

            {success ? (
              <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-xl text-center border border-emerald-500/20 font-bold">
                {success}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Justification Document (PDF or Images)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-blue-500 transition-colors bg-black/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-500 mb-3" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG, DOC (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {file && (
                    <p className="mt-2 text-sm text-emerald-400 text-center font-medium">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !file}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExemptionModal;
