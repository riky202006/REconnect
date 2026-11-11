import React from 'react';
import { Modal } from '../common/Modal';
import { CategoryBadge, SharingTypeBadge } from '../common/CategoryBadge';
import { StatusBadge, StampBadge } from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  User,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Tag,
  Clock,
  Package,
  Info,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ResourceDetailsModal = ({
  resource,
  isOpen,
  onClose,
  onRequest,
  isOwner = false
}) => {
  const { currentUser } = useAuth();

  if (!resource) return null;

  // Check if current user is owner
  const isResourceOwner = isOwner || resource.postedBy?.id === currentUser?.id;
  const isClaimed = resource.status === 'CLAIMED';
  const isReserved = resource.status === 'RESERVED';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Notice link copied to clipboard!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resource.title}
      subtitle={`Noticeboard Item • ${resource.community}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Main Image & Badges */}
        <div className="relative h-64 md:h-80 w-full bg-brand-paper border-2 border-brand-black rounded-neo overflow-hidden">
          <img
            src={resource.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
            alt={resource.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            <SharingTypeBadge type={resource.sharingType} />
            <CategoryBadge category={resource.category} className="bg-white" />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={resource.status} type="listing" />
          </div>

          {resource.isUrgent && (
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-brand-urgent text-white text-xs font-black uppercase border-2 border-brand-black rounded shadow-hard-sm z-10 animate-pulse">
              Urgent Need / Exam Pass
            </div>
          )}

          {isClaimed && (
            <div className="absolute inset-0 bg-brand-black/50 backdrop-blur-[1px] flex items-center justify-center z-20">
              <StampBadge status="CLAIMED" />
            </div>
          )}
        </div>

        {/* Essential Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-brand-paper border-2 border-brand-black rounded shadow-hard-sm">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Category</span>
            <span className="text-sm font-extrabold text-brand-black mt-0.5 block">{resource.category}</span>
          </div>

          <div className="p-3 bg-brand-paper border-2 border-brand-black rounded shadow-hard-sm">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Condition</span>
            <span className="text-sm font-extrabold text-brand-black mt-0.5 block">{resource.condition}</span>
          </div>

          <div className="p-3 bg-brand-paper border-2 border-brand-black rounded shadow-hard-sm">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Sharing Mode</span>
            <span className="text-sm font-extrabold text-brand-black mt-0.5 block">{resource.sharingType}</span>
          </div>

          <div className="p-3 bg-brand-paper border-2 border-brand-black rounded shadow-hard-sm">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Availability</span>
            <span className="text-sm font-extrabold text-brand-black mt-0.5 block">{resource.status}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-base font-black uppercase text-brand-black tracking-wide">
            Full Description & Student Notes
          </h4>
          <p className="text-sm text-neutral-800 leading-relaxed bg-white p-4 border-2 border-brand-black rounded-neo whitespace-pre-line">
            {resource.description}
          </p>
        </div>

        {/* Special Fields Based on Sharing Type & Category */}
        
        {/* 1. Borrow Details */}
        {resource.sharingType === 'BORROW' && (
          <div className="p-4 bg-brand-blue/25 border-2 border-brand-black rounded-neo space-y-2">
            <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-black">
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              <span>Borrowing Policy & Schedule</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-neutral-800">
              <div>
                <span className="text-neutral-600 block text-[10px] uppercase font-bold">Expected Period:</span>
                <span className="text-sm font-extrabold text-brand-black">{resource.returnPeriod || 'Mutual Semester Agreement'}</span>
              </div>
              <div>
                <span className="text-neutral-600 block text-[10px] uppercase font-bold">Return Date:</span>
                <span className="text-sm font-extrabold text-brand-black underline">{resource.returnDate || 'To be agreed at pickup'}</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-600 font-medium pt-1">
              Borrowers are trusted to return university equipment and books on time in original condition.
            </p>
          </div>
        )}

        {/* 2. Exchange Details */}
        {resource.sharingType === 'EXCHANGE' && (
          <div className="p-4 bg-brand-orange/25 border-2 border-brand-black rounded-neo space-y-2">
            <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-black">
              <Tag className="w-4 h-4 stroke-[2.5]" />
              <span>What Provider Wants in Exchange</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-brand-black">
                {resource.exchangeItem || resource.exchangeRequirements || 'Open to subject-related student trade'}
              </p>
              {resource.exchangeRequirements && resource.exchangeRequirements !== resource.exchangeItem && (
                <p className="text-xs text-neutral-700 font-medium">
                  Additional terms: {resource.exchangeRequirements}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 3. Food Category Details */}
        {resource.category === 'Food' && (
          <div className="p-4 bg-brand-urgent/15 border-2 border-brand-urgent rounded-neo space-y-2">
            <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-urgent">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <span>Pantry Food Safety & Expiry Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-neutral-900">
              <div className="p-2 bg-white/80 rounded border border-brand-black/20">
                <span className="text-[10px] uppercase text-neutral-500 block">Strict Expiry Date</span>
                <span className="text-sm font-black text-brand-urgent">{resource.foodExpiryDate || 'Not specified'}</span>
              </div>
              <div className="p-2 bg-white/80 rounded border border-brand-black/20 sm:col-span-2">
                <span className="text-[10px] uppercase text-neutral-500 block">Packaging & Seal</span>
                <span className="text-xs font-bold">{resource.packagingInfo || 'Factory sealed, unopened original container'}</span>
              </div>
            </div>
            {resource.storageInstructions && (
              <p className="text-xs text-neutral-800 font-medium">
                <strong>Storage Instructions:</strong> {resource.storageInstructions}
              </p>
            )}
          </div>
        )}

        {/* Pickup Location & Handover Spot */}
        <div className="p-4 bg-brand-chartreuse/30 border-2 border-brand-black rounded-neo space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-black">
            <MapPin className="w-4 h-4 text-brand-urgent stroke-[2.5]" />
            <span>Campus Pickup & Handover Details</span>
          </div>
          <p className="text-sm font-bold text-brand-black">
            {resource.pickupInfo}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700 font-medium pt-1">
            <span><strong>Campus Community:</strong> {resource.community}</span>
            {resource.contactPreference && (
              <>
                <span>•</span>
                <span><strong>Contact Preference:</strong> {resource.contactPreference}</span>
              </>
            )}
          </div>
        </div>

        {/* Provider Profile Card */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={resource.postedBy?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={resource.postedBy?.name}
              className="w-12 h-12 rounded-full border-2 border-brand-black object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-base text-brand-black">
                  {resource.postedBy?.name}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Campus Student" />
              </div>
              <p className="text-xs text-neutral-600 font-semibold">
                {resource.postedBy?.community || 'ADTU Member'} • Rating: ⭐ {resource.postedBy?.rating || '5.0'}
              </p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 border border-brand-black rounded hover:bg-brand-paper transition"
            title="Share this notice"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Own Listing Notice Banner */}
        {isResourceOwner && (
          <div className="p-3 bg-brand-paper border-2 border-dashed border-brand-black rounded text-xs font-bold text-neutral-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-black shrink-0" />
            <span>You pinned this notice. Manage, edit, or remove it from your <strong>My Listings</strong> dashboard.</span>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-4 border-t-2 border-brand-black flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-brand-black font-extrabold text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-100 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>

          {!isResourceOwner && !isClaimed ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequest?.(resource);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-brand-chartreuse text-brand-black font-black text-sm uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard hover:bg-yellow-300"
            >
              Request This Resource →
            </button>
          ) : isResourceOwner ? (
            <span className="text-xs font-mono font-bold uppercase text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded border border-neutral-300">
              Your Listed Resource
            </span>
          ) : (
            <span className="text-xs font-mono font-bold uppercase text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded border border-neutral-300">
              Resource Claimed / Unavailable
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};
