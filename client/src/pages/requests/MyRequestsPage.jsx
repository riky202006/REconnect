import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourceContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { ResourceDetailsModal } from '../../components/resources/ResourceDetailsModal';
import {
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  MapPin,
  MessageSquare,
  Calendar,
  ExternalLink,
  Package,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'READY_PICKUP', label: 'Ready for Pickup' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'CANCELLED', label: 'Cancelled' }
];

const TIMELINE_STEPS = [
  { key: 'SUBMITTED', label: 'Request Submitted', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { key: 'READY_PICKUP', label: 'Ready for Pickup', icon: MapPin },
  { key: 'COMPLETED', label: 'Completed', icon: Package }
];

export const MyRequestsPage = () => {
  const { currentUser } = useAuth();
  const {
    requests,
    resources,
    updateRequestStatus,
    cancelRequest,
    confirmCollection,
    confirmReturn
  } = useResources();

  // Active view: 'sent' (My requests to others) vs 'incoming' (requests on my listings)
  const [activeView, setActiveView] = useState('sent');
  const [activeTab, setActiveTab] = useState('ALL');

  // Modals state
  const [viewResourceModal, setViewResourceModal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'primary',
    onConfirm: () => {}
  });

  // Filter requests
  const mySentRequests = requests.filter(
    (r) => r.requester?.id === currentUser?.id || (!r.requester?.id && currentUser?.id === 'usr_001')
  );
  const incomingRequests = requests.filter(
    (r) => r.owner?.id === currentUser?.id
  );

  const currentList = activeView === 'sent' ? mySentRequests : incomingRequests;

  const filteredRequests = currentList.filter((req) => {
    if (activeTab === 'ALL') return true;
    return req.status === activeTab;
  });

  // Calculate step index for timeline
  const getStepProgress = (status) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'ACCEPTED':
        return 2;
      case 'READY_PICKUP':
        return 3;
      case 'COMPLETED':
        return 4;
      case 'REJECTED':
      case 'CANCELLED':
        return -1;
      default:
        return 1;
    }
  };

  // Helper to open details modal
  const handleViewResource = (req) => {
    const foundResource = resources.find((r) => r.id === req.resourceId) || {
      id: req.resourceId,
      title: req.resourceTitle,
      category: req.resourceCategory || 'Others',
      sharingType: req.sharingType || 'DONATE',
      condition: 'Good Condition',
      status: req.status === 'COMPLETED' ? 'CLAIMED' : 'AVAILABLE',
      description: req.message || 'Resource listed by campus peer.',
      pickupInfo: req.pickupLocation || 'Central Campus',
      images: [req.resourceImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
      postedBy: {
        id: req.owner?.id || 'usr_peer',
        name: req.owner?.name || 'Campus Member',
        community: 'ADTU - Main Campus (Panikhaiti)'
      }
    };
    setViewResourceModal(foundResource);
  };

  // Action: Cancel Request
  const handleCancelClick = (req) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Cancel Resource Request?',
      message: `Are you sure you want to cancel your request for "${req.resourceTitle}"? This cannot be undone.`,
      confirmText: 'Yes, Cancel Request',
      confirmVariant: 'danger',
      onConfirm: () => {
        cancelRequest(req.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Action: Confirm Collection
  const handleConfirmCollectionClick = (req) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Physical Collection',
      message: `Have you collected "${req.resourceTitle}" from ${req.owner?.name || 'the provider'}? This marks the handover complete and awards +50 RePoints.`,
      confirmText: 'Yes, I Collected It',
      confirmVariant: 'primary',
      onConfirm: () => {
        confirmCollection(req.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Action: Confirm Return (Borrowing)
  const handleConfirmReturnClick = (req) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Return of Borrowed Item',
      message: `Are you returning "${req.resourceTitle}" back to ${req.owner?.name || 'the provider'}? Both parties will verify the returned condition.`,
      confirmText: 'Confirm Handover Return',
      confirmVariant: 'primary',
      onConfirm: () => {
        confirmReturn(req.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 bg-brand-chartreuse border-3 border-brand-black rounded-neo shadow-hard-card overflow-hidden">
        {/* Tape decoration */}
        <div className="absolute -top-3 right-8 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black uppercase bg-brand-black text-white px-2 py-0.5 rounded inline-block">
              NOTICEBOARD REQUEST LOG
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading leading-tight">
              My Resource Requests
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800">
              Every request is a chance to give something a second life.
            </p>
          </div>

          {/* Perspective Switcher */}
          <div className="flex bg-white border-2 border-brand-black rounded shadow-hard-sm p-1 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveView('sent');
                setActiveTab('ALL');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded transition flex items-center gap-1.5 ${
                activeView === 'sent'
                  ? 'bg-brand-black text-white shadow-hard-sm'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Requests I Made ({mySentRequests.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveView('incoming');
                setActiveTab('ALL');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded transition flex items-center gap-1.5 ${
                activeView === 'incoming'
                  ? 'bg-brand-black text-white shadow-hard-sm'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Incoming for Me ({incomingRequests.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.key === 'ALL'
              ? currentList.length
              : currentList.filter((r) => r.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 text-xs font-black uppercase rounded-neo border-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-brand-black text-white border-brand-black shadow-hard-sm -translate-y-0.5'
                  : 'bg-white text-brand-black border-brand-black hover:bg-neutral-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  activeTab === tab.key
                    ? 'bg-brand-chartreuse text-brand-black'
                    : 'bg-neutral-200 text-neutral-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'ALL' ? '' : activeTab.toLowerCase()} requests found`}
          description={
            activeView === 'sent'
              ? "You haven't submitted any requests in this status tab. Explore the noticeboard to find items you need!"
              : 'No peers have submitted requests for your listings under this filter.'
          }
          actionLabel="Explore Noticeboard"
          actionPath="/explore"
        />
      ) : (
        <div className="space-y-5">
          {filteredRequests.map((req, idx) => {
            const stepProgress = getStepProgress(req.status);
            const isOwner = req.owner?.id === currentUser?.id;
            const otherParty = isOwner ? req.requester : req.owner;
            const sharingType = req.sharingType || 'DONATE';

            // Badge color based on sharing type
            const sharingTypeClass =
              sharingType === 'DONATE'
                ? 'bg-brand-pink text-brand-black'
                : sharingType === 'BORROW'
                ? 'bg-brand-blue text-brand-black'
                : 'bg-brand-orange text-brand-black';

            // Find image
            const targetResource = resources.find((r) => r.id === req.resourceId);
            const displayImage =
              req.resourceImage ||
              targetResource?.images?.[0] ||
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={req.id || idx}
                className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-5 sm:p-6 relative overflow-hidden transition-all hover:shadow-hard-xl"
              >
                {/* Tape strip decoration */}
                <div className="absolute -top-3 left-8 w-20 h-5 tape-strip rotate-1 pointer-events-none" />

                {/* Top Row: Badges & Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-brand-black/15 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded border border-brand-black ${sharingTypeClass}`}
                    >
                      {sharingType}
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-brand-paper border border-brand-black rounded text-neutral-800">
                      {req.resourceCategory || 'Campus Item'}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-600 font-semibold">
                    <div className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    {req.updatedAt && (
                      <span className="text-[11px] text-neutral-500 hidden sm:inline">
                        (Updated: {new Date(req.updatedAt).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-center">
                  {/* Thumbnail */}
                  <div className="md:col-span-3">
                    <div className="relative aspect-video sm:aspect-square md:aspect-auto md:h-32 w-full rounded border-2 border-brand-black overflow-hidden bg-neutral-100 shadow-hard-sm">
                      <img
                        src={displayImage}
                        alt={req.resourceTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-6 space-y-2">
                    <h3 className="font-heading font-black text-xl text-brand-black uppercase leading-tight hover:underline cursor-pointer"
                        onClick={() => handleViewResource(req)}>
                      {req.resourceTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                      <span>{isOwner ? 'Requested by:' : 'Provider:'}</span>
                      <span className="font-heading font-black text-sm text-brand-black px-1.5 py-0.5 bg-brand-paper border border-brand-black rounded">
                        {otherParty?.name || 'ADTU Member'}
                      </span>
                    </div>

                    {/* Message paper note */}
                    {req.message && (
                      <div className="p-3 bg-brand-bg border border-brand-black/30 rounded text-xs text-neutral-800 font-medium relative">
                        <div className="flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                          <p className="italic">"{req.message}"</p>
                        </div>
                      </div>
                    )}

                    {/* Pickup & Return Details */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-700 font-semibold pt-1">
                      {req.pickupLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-urgent shrink-0" />
                          <span>Pickup: {req.pickupLocation}</span>
                        </div>
                      )}
                      {req.preferredTime && (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                          <span>Time: {req.preferredTime}</span>
                        </div>
                      )}
                      {req.returnDate && sharingType === 'BORROW' && (
                        <div className="flex items-center gap-1 font-mono text-[11px] bg-brand-blue/30 px-2 py-0.5 border border-brand-black rounded">
                          <RotateCcw className="w-3.5 h-3.5 text-brand-black shrink-0" />
                          <span>Return by: {req.returnDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="md:col-span-3 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l-2 border-brand-black/15 pt-3 md:pt-0 md:pl-5">
                    <button
                      onClick={() => handleViewResource(req)}
                      className="w-full py-2 px-3 text-xs font-black uppercase bg-brand-paper hover:bg-neutral-200 border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Resource</span>
                    </button>

                    {/* Pending cancellation (requester only) */}
                    {req.status === 'PENDING' && !isOwner && (
                      <button
                        onClick={() => handleCancelClick(req)}
                        className="w-full py-2 px-3 text-xs font-black uppercase bg-white hover:bg-red-50 text-brand-urgent border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Request</span>
                      </button>
                    )}

                    {/* Ready for Pickup -> Confirm Collection */}
                    {req.status === 'READY_PICKUP' && (
                      <button
                        onClick={() => handleConfirmCollectionClick(req)}
                        className="w-full py-2.5 px-3 text-xs font-black uppercase bg-brand-chartreuse hover:bg-yellow-300 text-brand-black border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <Package className="w-4 h-4" />
                        <span>Confirm Collection</span>
                      </button>
                    )}

                    {/* Borrowed & Completed -> Confirm Return */}
                    {req.status === 'COMPLETED' && sharingType === 'BORROW' && !req.returned && (
                      <button
                        onClick={() => handleConfirmReturnClick(req)}
                        className="w-full py-2 px-3 text-xs font-black uppercase bg-brand-blue hover:bg-sky-300 text-brand-black border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Confirm Return</span>
                      </button>
                    )}

                    {/* If provider viewing an incoming pending request */}
                    {isOwner && req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateRequestStatus(req.id, 'ACCEPTED')}
                          className="flex-1 py-1.5 text-xs font-black uppercase bg-brand-chartreuse border-2 border-brand-black rounded shadow-hard-sm hover:bg-yellow-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'REJECTED')}
                          className="flex-1 py-1.5 text-xs font-black uppercase bg-white border-2 border-brand-black rounded shadow-hard-sm hover:bg-red-50 text-brand-urgent"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Perforated Tear-off Section: Visual Timeline */}
                <div className="mt-4 pt-4 border-t-2 border-dashed border-brand-black/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-black inline-block" />
                      Handover Progress Timeline (Tear-off Slip)
                    </span>
                    {req.status === 'REJECTED' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-red-100 text-brand-urgent border border-brand-urgent rounded">
                        Request Declined by Provider
                      </span>
                    )}
                    {req.status === 'CANCELLED' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-200 text-neutral-700 border border-neutral-400 rounded">
                        Request Cancelled
                      </span>
                    )}
                  </div>

                  {/* 4-Step Progress Line */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {TIMELINE_STEPS.map((step, sIdx) => {
                      const stepNum = sIdx + 1;
                      const isComplete = stepProgress >= stepNum;
                      const isCurrent = stepProgress === stepNum;
                      const isTerminalNegative =
                        req.status === 'REJECTED' || req.status === 'CANCELLED';

                      const StepIcon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className={`p-2.5 rounded border-2 transition-all flex items-center gap-2 relative ${
                            isTerminalNegative
                              ? 'bg-neutral-100 border-neutral-300 opacity-60 text-neutral-400'
                              : isComplete
                              ? 'bg-brand-chartreuse border-brand-black shadow-hard-sm text-brand-black'
                              : 'bg-white border-neutral-300 text-neutral-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-black ${
                              isComplete && !isTerminalNegative
                                ? 'bg-brand-black text-brand-chartreuse border-brand-black'
                                : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                            }`}
                          >
                            {isComplete && !isTerminalNegative ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              stepNum
                            )}
                          </div>

                          <div className="leading-tight overflow-hidden">
                            <p className="text-[11px] font-heading font-black uppercase truncate">
                              {step.label}
                            </p>
                            <p className="text-[9px] font-mono text-neutral-600">
                              {isCurrent && !isTerminalNegative
                                ? 'Current stage'
                                : isComplete && !isTerminalNegative
                                ? 'Verified'
                                : 'Upcoming'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resource Details Modal */}
      {viewResourceModal && (
        <ResourceDetailsModal
          resource={viewResourceModal}
          isOpen={!!viewResourceModal}
          onClose={() => setViewResourceModal(null)}
          onRequest={() => {
            setViewResourceModal(null);
            toast('You are currently viewing this request.', { icon: 'ℹ️' });
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmVariant={confirmDialog.confirmVariant}
      />
    </div>
  );
};