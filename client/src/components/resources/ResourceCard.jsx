import React from 'react';
import { CategoryBadge, SharingTypeBadge } from '../common/CategoryBadge';
import { StatusBadge, StampBadge } from '../common/StatusBadge';
import { MapPin, Clock, User, ArrowUpRight, AlertCircle, Calendar, Eye, BookmarkPlus } from 'lucide-react';

export const ResourceCard = ({
  resource,
  index = 0,
  onSelect,
  onRequest,
  showActions = true,
  actionButtonLabel = 'Tear Off to Request',
  isOwner = false,
  onEdit,
  onDelete
}) => {
  const isClaimed = resource.status === 'CLAIMED';
  const isReserved = resource.status === 'RESERVED';

  // Rotation variation for noticeboard paper aesthetic
  const rotations = ['rotate-[-0.75deg]', 'rotate-[0.5deg]', 'rotate-[-0.5deg]', 'rotate-[0.75deg]', 'rotate-[0deg]'];
  const cardRotation = rotations[index % rotations.length];

  // Tape angle variant
  const tapeAngle = index % 2 === 0 ? '-rotate-3' : 'rotate-2';

  return (
    <div
      className={`group relative bg-white border-2 border-brand-black rounded-neo shadow-hard-card hover:shadow-hard-xl hover:-translate-y-1.5 hover:rotate-0 transition-all duration-200 flex flex-col justify-between overflow-hidden ${cardRotation}`}
    >
      {/* Top Pushpin Decoration */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-3.5 h-3.5 rounded-full bg-brand-urgent border-2 border-brand-black shadow-sm" />
      </div>

      {/* Decorative Tape Strip */}
      <div className={`absolute -top-3.5 right-6 w-16 h-5 tape-strip ${tapeAngle} z-20 pointer-events-none`} />

      {/* Card Header & Image */}
      <div>
        <div className="relative h-44 w-full bg-brand-paper border-b-2 border-brand-black overflow-hidden">
          <img
            src={resource.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges: Sharing Type & Urgent */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10">
            <SharingTypeBadge type={resource.sharingType} />
            {resource.isUrgent && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-brand-urgent text-white border-2 border-brand-black rounded-sm shadow-hard-sm flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" /> URGENT
              </span>
            )}
          </div>

          {/* Status Badge Top Right */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <StatusBadge status={resource.status} type="listing" />
          </div>

          {/* Condition Tag */}
          <div className="absolute bottom-2 left-2.5 z-10">
            <span className="px-2 py-0.5 text-[11px] font-bold bg-white/95 backdrop-blur-sm text-brand-black border border-brand-black rounded-sm shadow-hard-sm">
              {resource.condition}
            </span>
          </div>

          {/* Rotated Stamp if claimed / unavailable */}
          {isClaimed && (
            <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-[1px] flex items-center justify-center z-30">
              <StampBadge status="CLAIMED" />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <CategoryBadge category={resource.category} />
            <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 font-mono">
              <Clock className="w-3 h-3" />
              {new Date(resource.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h3
            onClick={() => onSelect?.(resource)}
            className="text-lg font-black text-brand-black font-heading leading-snug cursor-pointer hover:underline line-clamp-2"
          >
            {resource.title}
          </h3>

          <p className="text-xs text-neutral-700 line-clamp-2 font-medium leading-relaxed">
            {resource.description}
          </p>

          {/* Community & Pickup */}
          <div className="pt-1 space-y-1 text-xs text-neutral-800">
            <div className="flex items-start gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-brand-urgent shrink-0 mt-0.5" />
              <span className="line-clamp-1">{resource.pickupInfo}</span>
            </div>
            <div className="text-[11px] font-semibold text-neutral-600 pl-5 truncate">
              Campus: {resource.community}
            </div>
          </div>

          {/* Extra metadata: return date or exchange req or food expiry */}
          {resource.sharingType === 'BORROW' && (resource.returnPeriod || resource.returnDate) && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-brand-blue/20 px-2 py-1 border border-brand-blue rounded">
              <Calendar className="w-3.5 h-3.5" />
              <span>{resource.returnPeriod ? `${resource.returnPeriod} • ` : ''}Due: {resource.returnDate || 'Mutual agreement'}</span>
            </div>
          )}

          {resource.sharingType === 'EXCHANGE' && (resource.exchangeItem || resource.exchangeRequirements) && (
            <div className="text-xs font-semibold text-neutral-800 bg-brand-orange/20 px-2 py-1 border border-brand-orange rounded line-clamp-1">
              <span className="font-bold">Wants:</span> {resource.exchangeItem || resource.exchangeRequirements}
            </div>
          )}

          {resource.category === 'Food' && resource.foodExpiryDate && (
            <div className="text-[11px] font-bold text-brand-urgent bg-brand-urgent/10 px-2 py-0.5 border border-brand-urgent rounded">
              Best Before: {resource.foodExpiryDate}
            </div>
          )}
        </div>
      </div>

      {/* Dashed Perforated Tear-off Noticeboard Section at Card Bottom */}
      <div className="mt-2 tear-off-border bg-brand-paper/50 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Provider details */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={resource.postedBy?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
            alt={resource.postedBy?.name}
            className="w-7 h-7 rounded-full border border-brand-black object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-brand-black truncate">
              {resource.postedBy?.name}
            </p>
            <p className="text-[10px] text-neutral-600 truncate font-hand text-sm -mt-0.5">
              ⭐ {resource.postedBy?.rating || '5.0'} • ADTU Peer
            </p>
          </div>
        </div>

        {/* Buttons: View Details & Tear-off Request Tab */}
        {showActions && (
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            {/* View Details Button */}
            <button
              type="button"
              onClick={() => onSelect?.(resource)}
              className="px-2.5 py-1.5 text-xs font-black uppercase tracking-wider bg-white text-brand-black border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-100 flex items-center gap-1 shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            {/* Action / Tear-off Tab */}
            {isOwner ? (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(resource)}
                    className="px-2 py-1.5 text-xs font-bold bg-brand-chartreuse text-brand-black border border-brand-black rounded hover:bg-yellow-300"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(resource.id)}
                    className="px-2 py-1.5 text-xs font-bold bg-brand-urgent text-white border border-brand-black rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled={isClaimed}
                onClick={() => {
                  if (onRequest) {
                    onRequest(resource);
                  } else if (onSelect) {
                    onSelect(resource);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard-sm transition flex items-center gap-1 shrink-0 ${
                  isClaimed
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                    : 'bg-brand-chartreuse text-brand-black hover:bg-yellow-300'
                }`}
                title={isClaimed ? 'Item is already claimed' : 'Tear off contact tab to request'}
              >
                <span>{isClaimed ? 'Claimed' : actionButtonLabel}</span>
                {!isClaimed && <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
