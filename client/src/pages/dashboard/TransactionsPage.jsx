import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourceContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import {
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Package,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Printer,
  FileCheck,
  Search,
  Filter,
  Check,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const FILTER_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'DONATION', label: 'Donation' },
  { key: 'BORROWING', label: 'Borrowing' },
  { key: 'EXCHANGE', label: 'Exchange' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'IN_PROGRESS', label: 'In Progress' }
];

export const TransactionsPage = () => {
  const { currentUser } = useAuth();
  const {
    transactions,
    confirmCollection,
    confirmReturn,
    updateTransactionStatus
  } = useResources();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'primary',
    onConfirm: () => {}
  });

  // Calculate statistics
  const totalTransactions = transactions.length;
  const successfulShares = transactions.filter((t) => t.status === 'COMPLETED').length;
  const activeBorrowings = transactions.filter(
    (t) => t.sharingType === 'BORROW' && t.status === 'IN_PROGRESS'
  ).length;
  const pendingHandovers = transactions.filter(
    (t) => t.status === 'PENDING_HANDOVER'
  ).length;

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    // 1. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = txn.resourceTitle?.toLowerCase().includes(q);
      const matchCode = txn.transactionCode?.toLowerCase().includes(q);
      const matchProvider = txn.provider?.name?.toLowerCase().includes(q);
      const matchReceiver = txn.receiver?.name?.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchProvider && !matchReceiver) return false;
    }

    // 2. Tab filter
    switch (activeFilter) {
      case 'DONATION':
        return txn.sharingType === 'DONATE';
      case 'BORROWING':
        return txn.sharingType === 'BORROW';
      case 'EXCHANGE':
        return txn.sharingType === 'EXCHANGE';
      case 'COMPLETED':
        return txn.status === 'COMPLETED';
      case 'IN_PROGRESS':
        return txn.status === 'IN_PROGRESS' || txn.status === 'PENDING_HANDOVER';
      case 'ALL':
      default:
        return true;
    }
  });

  // Action: Confirm Collection
  const handleConfirmCollection = (txn) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Physical Handover Collection',
      message: `Have you completed the handover of "${txn.resourceTitle}" between ${txn.provider.name} and ${txn.receiver.name}? This updates the status to Completed and awards RePoints.`,
      confirmText: 'Confirm Handover Done',
      confirmVariant: 'primary',
      onConfirm: () => {
        updateTransactionStatus(txn.id, 'COMPLETED', 'Handover collection verified and completed.');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Action: Confirm Return (Borrowing)
  const handleConfirmReturn = (txn) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Borrow Return Verification',
      message: `Confirm that "${txn.resourceTitle}" was returned by ${txn.receiver.name} to ${txn.provider.name} in good condition? This closes the loan record and awards +25 RePoints.`,
      confirmText: 'Verify Return',
      confirmVariant: 'primary',
      onConfirm: () => {
        confirmReturn(txn.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handlePrintReceipt = (txn) => {
    toast.success(`Digital receipt for ${txn.transactionCode} ready for export!`, {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        background: '#DDF247',
        color: '#121411',
        fontWeight: 'bold'
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
              CAMPUS EXCHANGE RECORD
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading leading-tight">
              Community Transactions
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800">
              Verified campus handovers, borrowing timelines, and sustainable peer exchanges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-white border-2 border-brand-black rounded shadow-hard-sm text-xs font-mono font-bold">
              {totalTransactions} Total Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center relative overflow-hidden">
          <div className="w-8 h-8 mx-auto bg-brand-paper border border-brand-black rounded-full flex items-center justify-center mb-1">
            <FileCheck className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {totalTransactions}
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-0.5">Total Transactions</p>
        </div>

        {/* Successful Shares */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center relative overflow-hidden">
          <div className="w-8 h-8 mx-auto bg-brand-chartreuse border border-brand-black rounded-full flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {successfulShares}
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-0.5">Successful Shares</p>
        </div>

        {/* Active Borrowings */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center relative overflow-hidden">
          <div className="w-8 h-8 mx-auto bg-brand-blue border border-brand-black rounded-full flex items-center justify-center mb-1">
            <RotateCcw className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {activeBorrowings}
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-0.5">Active Borrowings</p>
        </div>

        {/* Pending Handovers */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center relative overflow-hidden">
          <div className="w-8 h-8 mx-auto bg-brand-orange border border-brand-black rounded-full flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {pendingHandovers}
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-0.5">Pending Handovers</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by resource, member name, or code (e.g. TXN-2026)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3.5 py-1.5 text-xs font-black uppercase rounded-neo border-2 whitespace-nowrap transition-all ${
                activeFilter === tab.key
                  ? 'bg-brand-black text-white border-brand-black shadow-hard-sm -translate-y-0.5'
                  : 'bg-white text-brand-black border-brand-black hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description={
            searchQuery
              ? `No transactions match your search "${searchQuery}".`
              : 'No transaction records found under this filter.'
          }
          actionLabel="View All Transactions"
          actionPath="#"
        />
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((txn) => {
            const isBorrowing = txn.sharingType === 'BORROW';
            const isDonation = txn.sharingType === 'DONATE';
            const isExchange = txn.sharingType === 'EXCHANGE';

            // Sharing type badge color
            const typeColor = isDonation
              ? 'bg-brand-pink text-brand-black'
              : isBorrowing
              ? 'bg-brand-blue text-brand-black'
              : 'bg-brand-orange text-brand-black';

            // Status label & color
            const isCompleted = txn.status === 'COMPLETED';
            const isPending = txn.status === 'PENDING_HANDOVER';
            const isInProgress = txn.status === 'IN_PROGRESS';

            return (
              <div
                key={txn.id}
                className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-5 relative overflow-hidden transition hover:shadow-hard-xl"
              >
                {/* Tape decoration */}
                <div className="absolute -top-3 right-8 w-16 h-5 tape-strip rotate-1 pointer-events-none" />

                {/* Top Row: Code, Type, Status, Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-brand-black/15 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs px-2.5 py-1 bg-brand-black text-white rounded">
                      {txn.transactionCode}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-black uppercase px-2 py-0.5 rounded border border-brand-black ${typeColor}`}
                    >
                      {txn.sharingType}
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-brand-paper border border-brand-black rounded text-neutral-800">
                      {txn.category || 'General'}
                    </span>
                    <StatusBadge status={txn.status} />
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-600">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{txn.date}</span>
                  </div>
                </div>

                {/* Middle Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center">
                  {/* Thumbnail Image */}
                  <div className="md:col-span-2">
                    <div className="w-full aspect-video md:aspect-square rounded border-2 border-brand-black overflow-hidden bg-neutral-100 shadow-hard-sm">
                      <img
                        src={
                          txn.resourceImage ||
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={txn.resourceTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Main Details */}
                  <div className="md:col-span-6 space-y-2">
                    <h3
                      className="font-heading font-black text-lg sm:text-xl text-brand-black uppercase leading-tight hover:underline cursor-pointer"
                      onClick={() => setSelectedTxn(txn)}
                    >
                      {txn.resourceTitle}
                    </h3>

                    {/* Parties Handover Bar */}
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-500">From:</span>
                        <span className="px-2 py-0.5 bg-brand-paper border border-brand-black rounded font-heading font-black">
                          {txn.provider?.name}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-500">To:</span>
                        <span className="px-2 py-0.5 bg-brand-chartreuse border border-brand-black rounded font-heading font-black">
                          {txn.receiver?.name}
                        </span>
                      </div>
                    </div>

                    {/* Pickup Details & Return Date */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-700 font-semibold pt-1">
                      {txn.pickupDetails && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-urgent shrink-0" />
                          <span>{txn.pickupDetails}</span>
                        </div>
                      )}
                      {isBorrowing && txn.returnDate && (
                        <div className="flex items-center gap-1 bg-brand-blue/30 px-2 py-0.5 border border-brand-black rounded font-mono text-[11px]">
                          <RotateCcw className="w-3.5 h-3.5 text-brand-black shrink-0" />
                          <span>Return Due: {txn.returnDate}</span>
                        </div>
                      )}
                      {txn.pointsEarned > 0 && (
                        <span className="font-mono text-[11px] font-black text-brand-black bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded">
                          +{txn.pointsEarned} RePoints
                        </span>
                      )}
                    </div>

                    {/* Notes if present */}
                    {txn.notes && (
                      <p className="text-xs text-neutral-600 italic bg-brand-bg p-2 rounded border border-brand-black/20">
                        "{txn.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="md:col-span-4 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l-2 border-brand-black/15 pt-3 md:pt-0 md:pl-5">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="w-full py-2 px-3 text-xs font-black uppercase bg-brand-paper hover:bg-neutral-200 border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Transaction Details</span>
                    </button>

                    {/* Pending Handover Action */}
                    {isPending && (
                      <button
                        onClick={() => handleConfirmCollection(txn)}
                        className="w-full py-2 px-3 text-xs font-black uppercase bg-brand-chartreuse hover:bg-yellow-300 border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Confirm Collection</span>
                      </button>
                    )}

                    {/* Active Borrowing Return Action */}
                    {isBorrowing && isInProgress && (
                      <button
                        onClick={() => handleConfirmReturn(txn)}
                        className="w-full py-2 px-3 text-xs font-black uppercase bg-brand-blue hover:bg-sky-300 border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Confirm Return</span>
                      </button>
                    )}

                    {/* Completed receipt export */}
                    {isCompleted && (
                      <button
                        onClick={() => handlePrintReceipt(txn)}
                        className="w-full py-1.5 px-3 text-xs font-black uppercase bg-white hover:bg-neutral-100 border-2 border-brand-black rounded shadow-hard-sm transition flex items-center justify-center gap-1.5 text-neutral-800"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Handover Slip</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Campus Handover Slip"
        >
          <div className="space-y-4">
            <div className="p-4 bg-brand-paper border-2 border-brand-black rounded-neo relative">
              <div className="flex justify-between items-center border-b border-brand-black/20 pb-2 mb-3">
                <span className="font-mono font-black text-sm">{selectedTxn.transactionCode}</span>
                <StatusBadge status={selectedTxn.status} />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 block uppercase font-mono text-[10px]">Resource</span>
                  <p className="font-heading font-black text-base text-brand-black">
                    {selectedTxn.resourceTitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Provider</span>
                    <p className="font-bold text-brand-black">{selectedTxn.provider?.name}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Receiver</span>
                    <p className="font-bold text-brand-black">{selectedTxn.receiver?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Type</span>
                    <p className="font-bold text-brand-black">{selectedTxn.sharingType}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Date</span>
                    <p className="font-bold text-brand-black">{selectedTxn.date}</p>
                  </div>
                </div>

                {selectedTxn.returnDate && (
                  <div className="pt-1">
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Return Due Date</span>
                    <p className="font-bold text-brand-black">{selectedTxn.returnDate}</p>
                  </div>
                )}

                {selectedTxn.pickupDetails && (
                  <div className="pt-1">
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Pickup Location</span>
                    <p className="font-bold text-brand-black">{selectedTxn.pickupDetails}</p>
                  </div>
                )}

                {selectedTxn.notes && (
                  <div className="pt-1">
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Verification Note</span>
                    <p className="font-medium text-neutral-800 italic bg-white p-2 rounded border border-brand-black/20">
                      {selectedTxn.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePrintReceipt(selectedTxn)}
                className="flex-1 py-2 text-xs font-black uppercase bg-brand-chartreuse border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Export Slip</span>
              </button>
              <button
                onClick={() => setSelectedTxn(null)}
                className="py-2 px-4 text-xs font-black uppercase bg-brand-paper border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
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