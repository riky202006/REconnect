import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useResources } from '../../context/ResourceContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterBar } from '../../components/common/FilterBar';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { ResourceDetailsModal } from '../../components/resources/ResourceDetailsModal';
import { RequestResourceModal } from '../../components/resources/RequestResourceModal';
import { EmptyState } from '../../components/common/EmptyState';
import { PlusCircle, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExplorePage = () => {
  const { resources } = useResources();
  const { currentUser } = useAuth();
  const location = useLocation();

  // Parse search params if passed (e.g. ?category=Books)
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All Categories';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [selectedCommunity, setSelectedCommunity] = useState('All Communities');
  const [sortBy, setSortBy] = useState('recent'); // recent, urgent, popular

  const [selectedResource, setSelectedResource] = useState(null);
  const [requestingResource, setRequestingResource] = useState(null);

  // Dynamic filter matching
  const filteredResources = useMemo(() => {
    return resources
      .filter((item) => {
        // Search by name (title) or description dynamically
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim();
          const matchTitle = item.title?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        // Sharing type filter (Donate, Borrow, Exchange)
        if (selectedType !== 'ALL' && item.sharingType !== selectedType) {
          return false;
        }

        // Category filter (Books, Electronics, Clothing, Furniture, Food, Household, Others)
        if (selectedCategory !== 'All Categories') {
          if (item.category !== selectedCategory) return false;
        }

        // Condition filter
        if (selectedCondition && selectedCondition !== 'All Conditions') {
          if (item.condition !== selectedCondition) return false;
        }

        // Availability filter
        if (selectedAvailability && selectedAvailability !== 'ALL') {
          if (item.status !== selectedAvailability) return false;
        }

        // Community filter
        if (selectedCommunity && selectedCommunity !== 'All Communities') {
          if (item.community !== selectedCommunity) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgent') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
        }
        if (sortBy === 'popular') {
          return (b.requestsCount || 0) - (a.requestsCount || 0);
        }
        // Default: most recent
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [
    resources,
    searchTerm,
    selectedType,
    selectedCategory,
    selectedCondition,
    selectedAvailability,
    selectedCommunity,
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSelectedCategory('All Categories');
    setSelectedCondition('All Conditions');
    setSelectedAvailability('ALL');
    setSelectedCommunity('All Communities');
    setSortBy('recent');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with exact requested text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white border-2 border-brand-black rounded-neo shadow-hard-card relative overflow-hidden">
        {/* Tape decoration */}
        <div className="absolute -top-3 right-8 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase bg-brand-chartreuse px-2.5 py-0.5 border border-brand-black rounded">
              CAMPUS BOARD
            </span>
            <span className="font-hand text-base font-bold text-brand-black">
              Assam Down Town University Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading tracking-tight leading-tight">
            Explore the Noticeboard
          </h1>

          <p className="text-xs sm:text-sm text-neutral-700 font-semibold">
            Find something useful. Give something a second life.
          </p>
        </div>

        <Link
          to="/resources/share"
          className="px-4 py-2.5 bg-brand-chartreuse text-brand-black font-black text-xs uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 flex items-center justify-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Pin a Resource</span>
        </Link>
      </div>

      {/* 2. Dynamic Search & Filters */}
      <div className="space-y-4">
        {/* Dynamic Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search resources by name or description (e.g. Mathematics, Lab Coat, Desk, Calculator)..."
        />

        {/* Filters: Mode, Categories, Condition, Availability, Community */}
        <FilterBar
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedCondition={selectedCondition}
          onSelectCondition={setSelectedCondition}
          selectedAvailability={selectedAvailability}
          onSelectAvailability={setSelectedAvailability}
          selectedCommunity={selectedCommunity}
          onSelectCommunity={setSelectedCommunity}
          onReset={handleResetFilters}
        />
      </div>

      {/* Results Header: Count & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <span className="text-xs font-black uppercase text-brand-black font-mono">
          Showing {filteredResources.length} of {resources.length} Notices on Noticeboard
        </span>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs font-bold uppercase text-neutral-600">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1 text-xs font-bold uppercase bg-white border border-brand-black rounded shadow-hard-sm focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="urgent">Urgent First 🚨</option>
            <option value="popular">Most Requested 🔥</option>
          </select>
        </div>
      </div>

      {/* 3. Resource Cards Grid or Empty State */}
      {filteredResources.length === 0 ? (
        <EmptyState
          title="No notices found on the board"
          description="Try adjusting your search query, clearing filters, or choosing 'All Categories' to discover available campus equipment."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, idx) => (
            <ResourceCard
              key={res.id}
              resource={res}
              index={idx}
              isOwner={res.postedBy?.id === currentUser?.id}
              onSelect={(item) => setSelectedResource(item)}
              onRequest={(item) => setRequestingResource(item)}
              actionButtonLabel="Tear Off to Request"
            />
          ))}
        </div>
      )}

      {/* Resource Details Modal */}
      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onRequest={(item) => {
          setSelectedResource(null);
          setRequestingResource(item);
        }}
      />

      {/* Request Resource Confirmation Modal */}
      <RequestResourceModal
        resource={requestingResource}
        isOpen={!!requestingResource}
        onClose={() => setRequestingResource(null)}
      />
    </div>
  );
};
