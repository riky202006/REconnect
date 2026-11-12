import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useResources } from '../../context/ResourceContext';
import { useAuth } from '../../context/AuthContext';
import { Send, Clock, MapPin, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const RequestResourceModal = ({ resource, isOpen, onClose }) => {
  const { createRequest } = useResources();
  const { currentUser } = useAuth();

  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!resource) return null;

  const isOwner = resource.postedBy?.id === currentUser?.id;

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (isOwner) {
      toast.error('You cannot request your own resource!');
      return;
    }
    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    setSubmitting(true);
    try {
      const res = createRequest({
        resourceId: resource.id,
        message: message.trim() || `Hi ${resource.postedBy?.name}, I would love to request this ${resource.sharingType.toLowerCase()} item for my studies/hostel.`,
        preferredTime: preferredTime.trim() || 'Flexible this week'
      });

      if (res) {
        setMessage('');
        setPreferredTime('');
        setShowConfirm(false);
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirm}
        onClose={onClose}
        title="Tear-Off Request Slip"
        subtitle={`Requesting "${resource.title}" from ${resource.postedBy?.name}`}
        maxWidth="max-w-xl"
      >
        {isOwner ? (
          <div className="p-6 bg-red-50 border-2 border-brand-urgent rounded-neo text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-brand-urgent mx-auto" />
            <h4 className="font-heading font-black text-lg text-brand-urgent uppercase">
              Action Not Allowed
            </h4>
            <p className="text-xs font-semibold text-neutral-800">
              You are the provider of this notice. You cannot submit a tear-off request to yourself.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-black text-white font-bold text-xs uppercase rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleOpenConfirm} className="space-y-4">
            {/* Resource Summary Ticket */}
            <div className="p-3.5 bg-brand-paper border-2 border-brand-black rounded-neo flex items-center gap-3">
              <img
                src={resource.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                alt={resource.title}
                className="w-16 h-16 object-cover border border-brand-black rounded shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-brand-black text-white rounded">
                    {resource.sharingType}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-neutral-600 bg-white px-1.5 py-0.5 rounded border border-neutral-300">
                    {resource.category}
                  </span>
                </div>
                <h4 className="text-sm font-black text-brand-black truncate font-heading mt-1">
                  {resource.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-neutral-600 mt-0.5">
                  <MapPin className="w-3 h-3 text-brand-urgent shrink-0" />
                  <span className="truncate">{resource.pickupInfo}</span>
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-brand-black">
                Personal Message to {resource.postedBy?.name}:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Explain why you need this or propose your borrow/exchange terms...`}
                className="w-full p-3 bg-white border-2 border-brand-black rounded font-medium text-sm focus:outline-none focus:bg-brand-bg transition shadow-hard-sm"
              />
            </div>

            {/* Preferred Pickup Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-brand-black flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Preferred Meetup Day & Time:
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="e.g. Tomorrow around 4:30 PM outside Central Library"
                className="w-full px-3 py-2 bg-white border-2 border-brand-black rounded font-medium text-sm focus:outline-none focus:bg-brand-bg transition shadow-hard-sm"
              />
            </div>

            {/* RePoints incentive banner */}
            <div className="p-3 bg-brand-chartreuse/25 border border-brand-black rounded flex items-center gap-2 text-xs font-medium text-brand-black">
              <Sparkles className="w-4 h-4 text-brand-black shrink-0" />
              <span>
                Both provider and requester earn <strong>+50 RePoints</strong> once handover is verified!
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-brand-black/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white text-brand-black font-bold text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard flex items-center gap-2 hover:bg-yellow-300"
              >
                <span>Review & Confirm Request →</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirmation Step Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Tear-Off Request"
        subtitle="Review your details before pinning request to board"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-brand-paper border-2 border-brand-black rounded-neo space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-brand-black/20 pb-2">
              <span className="font-bold text-neutral-600">Resource:</span>
              <strong className="text-brand-black truncate max-w-[200px]">{resource.title}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-brand-black/20 pb-2">
              <span className="font-bold text-neutral-600">Provider:</span>
              <strong className="text-brand-black">{resource.postedBy?.name}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-brand-black/20 pb-2">
              <span className="font-bold text-neutral-600">Mode:</span>
              <span className="font-black uppercase">{resource.sharingType}</span>
            </div>
            <div>
              <span className="font-bold text-neutral-600 block mb-1">Your Message:</span>
              <p className="p-2 bg-white border border-brand-black/20 rounded italic">
                "{message.trim() || `I would like to request this item for my campus studies.`}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-black/20">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-white text-brand-black font-bold text-xs uppercase border border-brand-black rounded"
            >
              Back to Edit
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinalSubmit}
              className="px-5 py-2 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard flex items-center gap-1.5 hover:bg-yellow-300"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{submitting ? 'Submitting...' : 'Confirm & Send Request'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
