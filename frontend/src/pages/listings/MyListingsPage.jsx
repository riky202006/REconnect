import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourceContext';
import { ResourceDetailsModal } from '../../components/resources/ResourceDetailsModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge, SharingTypeBadge } from '../../components/common/CategoryBadge';
import { CATEGORIES, ITEM_CONDITIONS } from '../../constants';
import {
  Layers,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  Eye,
  MessageSquare,
  Sparkles,
  Inbox,
  Clock,
  MapPin,
  Check,
  X,
  FileText,
  Send,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MyListingsPage = () => {
  const { currentUser } = useAuth();
  const {
    resources,
    deleteResource,
    markResourceStatus,
    updateResource,
    requests,
    updateRequestStatus,
    drafts,
    deleteDraft,
    addResource,
    transactions
  } = useResources();

  const navigate = useNavigate();

  // Tab: 'all' | 'active' | 'pending' | 'completed' | 'drafts'
  const [activeTab, setActiveTab] = useState('all');

  // Modals state
  const [selectedResource, setSelectedResource] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingDraftId, setDeletingDraftId] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [viewingRequestsForListing, setViewingRequestsForListing] = useState(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('Books');
  const [editCondition, setEditCondition] = useState('Good Condition');
  const [editPickup, setEditPickup] = useState('');

  // Current user's resources
  const myListings = resources.filter(r => r.postedBy?.id === currentUser?.id);
  // All incoming requests for user's items
  const myIncomingRequests = requests.filter(r => r.owner?.id === currentUser?.id);
  const pendingRequestsCount = myIncomingRequests.filter(r => r.status === 'PENDING').length;
  const completedSharesCount = transactions.filter(t => t.status === 'COMPLETED').length + myListings.filter(r => r.status === 'CLAIMED').length;

  // Filter listings by tab
  const filteredListings = myListings.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return item.status === 'AVAILABLE';
    if (activeTab === 'pending') {
      const hasPendingReqs = requests.some(req => req.resourceId === item.id && req.status === 'PENDING');
      return item.status === 'RESERVED' || hasPendingReqs;
    }
    if (activeTab === 'completed') return item.status === 'CLAIMED' || item.status === 'UNAVAILABLE';
    return true;
  });

  // Open Edit Modal
  const handleOpenEdit = (res) => {
    setEditingResource(res);
    setEditTitle(res.title);
    setEditDesc(res.description);
    setEditCategory(res.category || 'Books');
    setEditCondition(res.condition || 'Good Condition');
    setEditPickup(res.pickupInfo);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingResource) return;
    updateResource(editingResource.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      condition: editCondition,
      pickupInfo: editPickup.trim()
    });
    setEditingResource(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteResource(deletingId);
      setDeletingId(null);
    }
  };

  const handleDeleteDraftConfirm = () => {
    if (deletingDraftId) {
      deleteDraft(deletingDraftId);
      setDeletingDraftId(null);
    }
  };

  const handlePublishDraft = (draft) => {
    addResource({
      title: draft.title,
      description: draft.description || 'Draft published to noticeboard',
      category: draft.category || 'Books',
      sharingType: draft.sharingType || 'DONATE',
      condition: draft.condition || 'Good Condition',
      community: draft.community || currentUser?.community || 'ADTU - Main Campus (Panikhaiti)',
      pickupInfo: draft.pickupInfo || 'Central Library Ground Floor',
      images: draft.images && draft.images.length ? draft.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
    });
    deleteDraft(draft.id);
    setActiveTab('active');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with exact requested text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white border-2 border-brand-black rounded-neo shadow-hard-card relative overflow-hidden">
        <div className="absolute -top-3 right-8 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-black uppercase bg-brand-chartreuse px-2.5 py-0.5 border border-brand-black rounded inline-block">
            INVENTORY & EXCHANGES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading mt-1">
            My Listings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Manage your pinned notices, review incoming peer requests, and complete handovers.
          </p>
        </div>

        <Link
          to="/resources/share"
          className="px-4 py-2.5 bg-brand-chartreuse text-brand-black font-black text-xs uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 flex items-center justify-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Pin Another Resource</span>
        </Link>
      </div>

      {/* 2. Display Statistics: Total, Active, Pending Requests, Completed Shares */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm">
          <span className="text-[10px] font-black uppercase text-neutral-600 block">Total Listings</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black mt-0.5 block">
            {myListings.length}
          </span>
          <p className="text-[11px] text-neutral-500 font-medium">All notices created</p>
        </div>

        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm">
          <span className="text-[10px] font-black uppercase text-neutral-600 block">Active Listings</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black mt-0.5 block">
            {myListings.filter(r => r.status === 'AVAILABLE').length}
          </span>
          <p className="text-[11px] text-neutral-500 font-medium">Visible on campus board</p>
        </div>

        <div className="p-4 bg-brand-paper border-2 border-brand-black rounded-neo shadow-hard-sm">
          <span className="text-[10px] font-black uppercase text-neutral-600 block">Pending Requests</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black mt-0.5 block">
            {pendingRequestsCount}
          </span>
          <p className="text-[11px] text-neutral-500 font-medium">Awaiting your response</p>
        </div>

        <div className="p-4 bg-brand-chartreuse/30 border-2 border-brand-black rounded-neo shadow-hard-sm">
          <span className="text-[10px] font-black uppercase text-brand-black block">Completed Shares</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black mt-0.5 block">
            {completedSharesCount}
          </span>
          <p className="text-[11px] text-neutral-700 font-bold">+50 RePoints each</p>
        </div>
      </div>

      {/* 3. Five Tabs: All Listings, Active, Pending, Completed, Drafts */}
      <div className="flex border-b-2 border-brand-black gap-1.5 sm:gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-l-2 border-r-2 border-brand-black rounded-t transition shrink-0 ${
            activeTab === 'all'
              ? 'bg-brand-chartreuse text-brand-black shadow-none font-black'
              : 'bg-brand-paper text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All Listings ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-l-2 border-r-2 border-brand-black rounded-t transition shrink-0 ${
            activeTab === 'active'
              ? 'bg-brand-chartreuse text-brand-black shadow-none font-black'
              : 'bg-brand-paper text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Active ({myListings.filter(r => r.status === 'AVAILABLE').length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-l-2 border-r-2 border-brand-black rounded-t transition shrink-0 ${
            activeTab === 'pending'
              ? 'bg-brand-chartreuse text-brand-black shadow-none font-black'
              : 'bg-brand-paper text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Pending ({myListings.filter(r => r.status === 'RESERVED' || requests.some(req => req.resourceId === r.id && req.status === 'PENDING')).length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-l-2 border-r-2 border-brand-black rounded-t transition shrink-0 ${
            activeTab === 'completed'
              ? 'bg-brand-chartreuse text-brand-black shadow-none font-black'
              : 'bg-brand-paper text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Completed ({myListings.filter(r => r.status === 'CLAIMED' || r.status === 'UNAVAILABLE').length})
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-t-2 border-l-2 border-r-2 border-brand-black rounded-t transition shrink-0 ${
            activeTab === 'drafts'
              ? 'bg-brand-chartreuse text-brand-black shadow-none font-black'
              : 'bg-brand-paper text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Drafts ({drafts.length})
        </button>
      </div>

      {/* 4. Tab Content: Drafts Tab */}
      {activeTab === 'drafts' ? (
        drafts.length === 0 ? (
          <EmptyState
            title="No saved drafts"
            description="When you save an uncompleted resource form, it will be stored safely here."
            actionText="Create a Notice"
            actionLink="/resources/share"
          />
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white border-2 border-dashed border-brand-black rounded-neo shadow-hard-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <img
                    src={draft.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                    alt={draft.title}
                    className="w-20 h-20 object-cover border border-brand-black rounded shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-neutral-200 text-brand-black rounded border border-brand-black">
                        DRAFT
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-brand-paper px-1.5 py-0.5 rounded border border-neutral-300">
                        {draft.category || 'General'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Saved: {new Date(draft.savedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-brand-black truncate">
                      {draft.title}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-1 font-medium">
                      {draft.description || 'No description provided yet.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handlePublishDraft(draft)}
                    className="px-4 py-2 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Publish to Board</span>
                  </button>
                  <button
                    onClick={() => setDeletingDraftId(draft.id)}
                    className="p-2 bg-brand-urgent text-white border-2 border-brand-black rounded hover:bg-red-600 transition"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Listings Tab Content */
        filteredListings.length === 0 ? (
          <EmptyState
            title="No listings in this view"
            description="You don't have any resources matching this tab filter."
            actionText="Pin a Resource Now"
            actionLink="/resources/share"
          />
        ) : (
          <div className="space-y-4">
            {filteredListings.map((res) => {
              const itemRequests = requests.filter(req => req.resourceId === res.id);
              const pendingItemRequests = itemRequests.filter(req => req.status === 'PENDING');
              const isAvailable = res.status === 'AVAILABLE';

              return (
                <div
                  key={res.id}
                  className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:shadow-hard-lg"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img
                      src={res.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                      alt={res.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-brand-black rounded shrink-0"
                    />

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <SharingTypeBadge type={res.sharingType} />
                        <CategoryBadge category={res.category} />
                        <StatusBadge status={res.status} type="listing" />
                        <span className="text-[10px] font-mono text-neutral-500 font-semibold">
                          Posted: {new Date(res.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedResource(res)}
                        className="font-heading font-black text-base sm:text-lg text-brand-black hover:underline cursor-pointer truncate"
                      >
                        {res.title}
                      </h3>

                      <p className="text-xs text-neutral-600 line-clamp-1 font-medium">
                        {res.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-neutral-700 font-medium">
                        <span className="truncate">📍 {res.pickupInfo}</span>
                        <span>•</span>
                        {/* Number of incoming requests */}
                        <button
                          type="button"
                          onClick={() => setViewingRequestsForListing(res)}
                          className={`flex items-center gap-1 font-black px-2 py-0.5 rounded border border-brand-black cursor-pointer transition ${
                            pendingItemRequests.length > 0
                              ? 'bg-brand-chartreuse text-brand-black animate-pulse shadow-hard-sm'
                              : 'bg-brand-paper text-brand-black'
                          }`}
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{itemRequests.length} Incoming Request{itemRequests.length === 1 ? '' : 's'}</span>
                          {pendingItemRequests.length > 0 && (
                            <span className="text-[9px] bg-brand-urgent text-white px-1 rounded-full font-mono">
                              {pendingItemRequests.length} New
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: View Details, Edit, Delete, Toggle Availability, View Requests */}
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedResource(res)}
                      className="px-2.5 py-1.5 text-xs font-bold bg-white text-brand-black border-2 border-brand-black rounded hover:bg-neutral-100 flex items-center gap-1"
                      title="View Full Notice Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {/* View Incoming Requests Button */}
                    <button
                      onClick={() => setViewingRequestsForListing(res)}
                      className="px-2.5 py-1.5 text-xs font-bold bg-brand-paper text-brand-black border-2 border-brand-black rounded hover:bg-neutral-200 flex items-center gap-1"
                      title="View peer requests for this resource"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Requests ({itemRequests.length})</span>
                    </button>

                    {/* Mark as Available / Unavailable Toggle */}
                    <button
                      onClick={() => markResourceStatus(res.id, isAvailable ? 'UNAVAILABLE' : 'AVAILABLE')}
                      className="px-2.5 py-1.5 text-xs font-bold bg-white text-brand-black border-2 border-brand-black rounded hover:bg-neutral-100 transition"
                      title={isAvailable ? 'Mark notice unavailable' : 'Mark notice available'}
                    >
                      {isAvailable ? 'Mark Pause' : 'Mark Available'}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="p-1.5 bg-brand-chartreuse text-brand-black border-2 border-brand-black rounded hover:bg-yellow-300 transition"
                      title="Edit Notice Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeletingId(res.id)}
                      className="p-1.5 bg-brand-urgent text-white border-2 border-brand-black rounded hover:bg-red-600 transition"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 5. Incoming Requests Modal for Listing */}
      <Modal
        isOpen={!!viewingRequestsForListing}
        onClose={() => setViewingRequestsForListing(null)}
        title="Incoming Requests for Resource"
        subtitle={viewingRequestsForListing?.title || ''}
        maxWidth="max-w-2xl"
      >
        {(() => {
          const listingReqs = requests.filter(r => r.resourceId === viewingRequestsForListing?.id);

          if (listingReqs.length === 0) {
            return (
              <div className="py-8 text-center text-xs font-bold text-neutral-500">
                No tear-off requests received yet for this listing. It is actively displayed on the campus board!
              </div>
            );
          }

          return (
            <div className="space-y-4 divide-y divide-brand-black/15">
              {listingReqs.map((req) => (
                <div key={req.id} className="pt-3 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={req.requester?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'}
                        alt={req.requester?.name}
                        className="w-10 h-10 rounded-full border-2 border-brand-black object-cover mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-sm text-brand-black">
                            {req.requester?.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase bg-brand-paper px-1.5 py-0.5 border border-brand-black rounded">
                            {req.requester?.department}
                          </span>
                          <StatusBadge status={req.status} type="request" />
                        </div>
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                          Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-neutral-600">
                      ID: {req.id}
                    </span>
                  </div>

                  {/* Personal Message */}
                  <div className="p-3 bg-brand-paper/50 border border-brand-black rounded text-xs text-neutral-800">
                    <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">Personal Message:</span>
                    <p className="italic">"{req.message}"</p>
                    {req.preferredTime && (
                      <p className="text-[11px] font-bold text-brand-black mt-1">
                        Meetup time proposed: {req.preferredTime}
                      </p>
                    )}
                  </div>

                  {/* Accept / Reject actions */}
                  {req.status === 'PENDING' ? (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => updateRequestStatus(req.id, 'ACCEPTED')}
                        className="px-3.5 py-1.5 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Accept Request
                      </button>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'REJECTED')}
                        className="px-3.5 py-1.5 bg-white text-brand-urgent font-bold text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-red-50 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" /> Decline
                      </button>
                    </div>
                  ) : req.status === 'ACCEPTED' ? (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-emerald-700">✓ Accepted - Awaiting Handover</span>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'COMPLETED')}
                        className="px-3 py-1 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border border-brand-black rounded"
                      >
                        Mark Completed (+50 PTS)
                      </button>
                    </div>
                  ) : (
                    <div className="text-right text-xs font-bold text-neutral-500 pt-1">
                      Status: {req.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </Modal>

      {/* 6. Edit Listing Modal */}
      <Modal
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        title="Edit Resource Notice"
        subtitle="Update notice information on the campus board"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase text-brand-black">
              Resource Title: <span className="text-brand-urgent">*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white text-brand-black text-sm font-semibold border-2 border-brand-black rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Category:
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-white text-brand-black text-xs font-bold border-2 border-brand-black rounded"
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Condition:
              </label>
              <select
                value={editCondition}
                onChange={(e) => setEditCondition(e.target.value)}
                className="w-full px-2.5 py-2 bg-white text-brand-black text-xs font-bold border-2 border-brand-black rounded"
              >
                {ITEM_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase text-brand-black">
              Description: <span className="text-brand-urgent">*</span>
            </label>
            <textarea
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full p-2.5 bg-white text-brand-black text-sm font-medium border-2 border-brand-black rounded"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase text-brand-black">
              Pickup Spot: <span className="text-brand-urgent">*</span>
            </label>
            <input
              type="text"
              value={editPickup}
              onChange={(e) => setEditPickup(e.target.value)}
              className="w-full px-3 py-2 bg-white text-brand-black text-sm font-semibold border-2 border-brand-black rounded"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-black/20">
            <button
              type="button"
              onClick={() => setEditingResource(null)}
              className="px-4 py-2 bg-white text-brand-black font-bold text-xs uppercase border border-brand-black rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* 7. Resource Details Modal */}
      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        isOwner={true}
      />

      {/* 8. Delete Confirmation Dialog for Listing */}
      <ConfirmationDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Listing from Board?"
        message="Are you sure you want to delete this resource listing? This action removes it permanently from the campus noticeboard."
        confirmText="Yes, Delete Listing"
      />

      {/* 9. Delete Confirmation Dialog for Draft */}
      <ConfirmationDialog
        isOpen={!!deletingDraftId}
        onClose={() => setDeletingDraftId(null)}
        onConfirm={handleDeleteDraftConfirm}
        title="Discard Draft?"
        message="Are you sure you want to delete this saved draft?"
        confirmText="Yes, Discard Draft"
      />
    </div>
  );
};
