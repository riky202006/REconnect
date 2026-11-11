import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResources } from '../../context/ResourceContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, ITEM_CONDITIONS, COMMUNITIES, SHARING_TYPES } from '../../constants';
import {
  UploadCloud,
  PlusCircle,
  FileText,
  Calendar,
  AlertCircle,
  MapPin,
  Check,
  Image as ImageIcon,
  HelpCircle,
  Save,
  Trash2,
  Clock,
  Tag,
  ShieldAlert,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

// Curated campus photo presets
const PRESET_PHOTOS = [
  { label: 'Books & Reference', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Electronics & Kits', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lab Coat & Wear', url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hostel Furniture & Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pantry & Food Items', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Household Appliances', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80' },
];

export const ShareResourcePage = () => {
  const { addResource, saveDraft } = useResources();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Books
  const [sharingType, setSharingType] = useState('DONATE'); // DONATE, BORROW, EXCHANGE
  const [condition, setCondition] = useState(ITEM_CONDITIONS[1]); // Like New

  // Image Upload and Preview
  const [imagePreview, setImagePreview] = useState(PRESET_PHOTOS[0].url);

  // Conditional: For Borrow
  const [returnPeriod, setReturnPeriod] = useState('Current Semester (~4 Weeks)');
  const [returnDate, setReturnDate] = useState('');

  // Conditional: For Exchange
  const [exchangeItem, setExchangeItem] = useState('');
  const [exchangeDescription, setExchangeDescription] = useState('');

  // Conditional: For Food
  const [foodExpiryDate, setFoodExpiryDate] = useState('');
  const [packagingInfo, setPackagingInfo] = useState('Original factory vacuum seal intact');
  const [storageInstructions, setStorageInstructions] = useState('Store in cool, dry place away from sunlight');

  // Other Information
  const [community, setCommunity] = useState(currentUser?.community || COMMUNITIES[1]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [contactPreference, setContactPreference] = useState('Campus Email (@adtu.edu.in)');

  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Image file handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Allow image removal
  const handleRemoveImage = () => {
    setImagePreview('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Resource name is required.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a clear description.';
    }

    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = 'Campus pickup spot is required.';
    }

    // Borrow validation
    if (sharingType === 'BORROW' && !returnDate) {
      newErrors.returnDate = 'Please specify the expected return date.';
    }

    // Exchange validation
    if (sharingType === 'EXCHANGE' && !exchangeItem.trim()) {
      newErrors.exchangeItem = 'Please specify what you want in exchange.';
    }

    // Food validation (Mandatory and must NOT be expired!)
    if (category === 'Food') {
      if (!foodExpiryDate) {
        newErrors.foodExpiryDate = 'Food expiry date is mandatory.';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(foodExpiryDate);
        if (expiry < today) {
          newErrors.foodExpiryDate = 'Expiry date has already passed. Expired food items are strictly prohibited.';
        }
      }

      if (!packagingInfo.trim()) {
        newErrors.packagingInfo = 'Packaging information is required for food safety.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit / Publish to Noticeboard
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please resolve the highlighted errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      addResource({
        title: title.trim(),
        description: description.trim(),
        category,
        sharingType,
        condition,
        community,
        pickupInfo: pickupLocation.trim(),
        contactPreference,
        isUrgent,
        returnPeriod: sharingType === 'BORROW' ? returnPeriod : null,
        returnDate: sharingType === 'BORROW' ? returnDate : null,
        exchangeItem: sharingType === 'EXCHANGE' ? exchangeItem.trim() : null,
        exchangeRequirements: sharingType === 'EXCHANGE' ? (exchangeDescription.trim() || exchangeItem.trim()) : null,
        foodExpiryDate: category === 'Food' ? foodExpiryDate : null,
        packagingInfo: category === 'Food' ? packagingInfo.trim() : null,
        storageInstructions: category === 'Food' ? storageInstructions.trim() : null,
        images: imagePreview ? [imagePreview] : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
      });

      // Redirect to My Listings after publishing
      navigate('/dashboard/listings');
    } finally {
      setSubmitting(false);
    }
  };

  // Save as Draft locally
  const handleSaveDraft = () => {
    if (!title.trim()) {
      toast.error('Please enter at least a resource name to save a draft.');
      return;
    }

    saveDraft({
      title: title.trim(),
      description: description.trim(),
      category,
      sharingType,
      condition,
      community,
      pickupInfo: pickupLocation.trim(),
      contactPreference,
      returnPeriod,
      returnDate,
      exchangeItem,
      exchangeRequirements: exchangeDescription,
      foodExpiryDate,
      packagingInfo,
      storageInstructions,
      images: imagePreview ? [imagePreview] : []
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white border-2 border-brand-black rounded-neo shadow-hard-card relative overflow-hidden">
        <div className="absolute -top-3 right-8 w-24 h-6 tape-strip -rotate-2 pointer-events-none" />
        <span className="text-[10px] font-mono font-black uppercase bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded inline-block">
          NEW NOTICE CREATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-brand-black font-heading mt-1">
          Share a Resource with ADTU Community
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-medium font-hand text-base">
          Pin what you don't need so another student can pass their semester or save money.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
        {/* Section 1: Basic Information */}
        <div className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
          <h3 className="font-heading font-black text-base uppercase text-brand-black border-b-2 border-brand-black pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 stroke-[2.5]" />
            1. Basic Information
          </h3>

          {/* Resource Name */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase text-brand-black">
              Resource Name / Title: <span className="text-brand-urgent">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: null }));
              }}
              placeholder="e.g. Erwin Kreyszig 10th Ed Engineering Math or Casio FX-991EX Calculator"
              className={`w-full px-3.5 py-2.5 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                errors.title ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
              }`}
            />
            {errors.title && (
              <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase text-brand-black">
              Description & Helpful Details: <span className="text-brand-urgent">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              placeholder="Provide edition, condition details, accessories included, syllabus relevance, or why you are giving it away..."
              className={`w-full p-3 bg-brand-bg text-brand-black text-sm font-medium border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                errors.description ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
              }`}
            />
            {errors.description && (
              <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Category: <span className="text-brand-urgent">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-brand-bg text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm focus:outline-none focus:bg-white"
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Physical Condition: <span className="text-brand-urgent">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 bg-brand-bg text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm focus:outline-none focus:bg-white"
              >
                {ITEM_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Sharing Type Selection */}
        <div className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
          <h3 className="font-heading font-black text-base uppercase text-brand-black border-b-2 border-brand-black pb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            2. Choose Sharing Mode
          </h3>

          {/* 3 Sharing Type Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(SHARING_TYPES).map((type) => {
              const isSelected = sharingType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSharingType(type.id)}
                  className={`p-4 border-2 border-brand-black rounded-neo text-left transition-all relative ${
                    isSelected
                      ? `${type.bgClass} shadow-hard translate-x-[2px] translate-y-[2px]`
                      : 'bg-white shadow-hard-sm hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-black text-sm uppercase text-brand-black">
                      {type.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-brand-black text-white rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-800 leading-snug font-medium">
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Conditional Field: BORROW Mode */}
          {sharingType === 'BORROW' && (
            <div className="p-4 bg-brand-blue/20 border-2 border-brand-black rounded-neo space-y-3">
              <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-black">
                <Calendar className="w-4 h-4" />
                <span>Borrowing Duration & Return Date</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-brand-black">
                    Expected Return Period:
                  </label>
                  <input
                    type="text"
                    value={returnPeriod}
                    onChange={(e) => setReturnPeriod(e.target.value)}
                    placeholder="e.g. 2 Weeks or Current Semester"
                    className="w-full px-3 py-2 bg-white text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-brand-black">
                    Exact Return Deadline: <span className="text-brand-urgent">*</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      if (errors.returnDate) setErrors(prev => ({ ...prev, returnDate: null }));
                    }}
                    className={`w-full px-3 py-2 bg-white text-brand-black text-xs font-bold border-2 rounded shadow-hard-sm ${
                      errors.returnDate ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                    }`}
                  />
                  {errors.returnDate && (
                    <p className="text-xs font-bold text-brand-urgent">{errors.returnDate}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conditional Field: EXCHANGE Mode */}
          {sharingType === 'EXCHANGE' && (
            <div className="p-4 bg-brand-orange/20 border-2 border-brand-black rounded-neo space-y-3">
              <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-black">
                <Tag className="w-4 h-4" />
                <span>Exchange & Swap Requirements</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-brand-black">
                    Required Exchange Item: <span className="text-brand-urgent">*</span>
                  </label>
                  <input
                    type="text"
                    value={exchangeItem}
                    onChange={(e) => {
                      setExchangeItem(e.target.value);
                      if (errors.exchangeItem) setErrors(prev => ({ ...prev, exchangeItem: null }));
                    }}
                    placeholder="e.g. Python for Data Analysis Handbook or Badminton Racket"
                    className={`w-full px-3 py-2 bg-white text-brand-black text-xs font-bold border-2 rounded shadow-hard-sm ${
                      errors.exchangeItem ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                    }`}
                  />
                  {errors.exchangeItem && (
                    <p className="text-xs font-bold text-brand-urgent">{errors.exchangeItem}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-brand-black">
                    Additional Exchange Description / Acceptable Equivalents:
                  </label>
                  <textarea
                    rows={2}
                    value={exchangeDescription}
                    onChange={(e) => setExchangeDescription(e.target.value)}
                    placeholder="Willing to consider other computer science reference books or lab gear..."
                    className="w-full p-2.5 bg-white text-brand-black text-xs font-medium border-2 border-brand-black rounded shadow-hard-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Field: FOOD Category */}
          {category === 'Food' && (
            <div className="p-4 bg-brand-urgent/15 border-2 border-brand-urgent rounded-neo space-y-3">
              <div className="flex items-center gap-2 text-sm font-black uppercase text-brand-urgent">
                <ShieldAlert className="w-4 h-4" />
                <span>Mandatory Campus Food Safety Standards</span>
              </div>
              <p className="text-xs text-neutral-800 font-medium">
                ADTU policy mandates that shared food items must be strictly unexpired, non-perishable, and factory sealed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-brand-urgent">
                    Expiry / Best Before Date: <span className="text-brand-urgent">*</span>
                  </label>
                  <input
                    type="date"
                    value={foodExpiryDate}
                    onChange={(e) => {
                      setFoodExpiryDate(e.target.value);
                      if (errors.foodExpiryDate) setErrors(prev => ({ ...prev, foodExpiryDate: null }));
                    }}
                    className={`w-full px-3 py-2 bg-white text-brand-black text-xs font-bold border-2 rounded shadow-hard-sm ${
                      errors.foodExpiryDate ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                    }`}
                  />
                  {errors.foodExpiryDate && (
                    <p className="text-xs font-bold text-brand-urgent">{errors.foodExpiryDate}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-brand-black">
                    Packaging Information: <span className="text-brand-urgent">*</span>
                  </label>
                  <input
                    type="text"
                    value={packagingInfo}
                    onChange={(e) => setPackagingInfo(e.target.value)}
                    placeholder="e.g. Original factory vacuum seal intact"
                    className="w-full px-3 py-2 bg-white text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase text-brand-black">
                  Storage Instructions:
                </label>
                <input
                  type="text"
                  value={storageInstructions}
                  onChange={(e) => setStorageInstructions(e.target.value)}
                  placeholder="e.g. Keep dry in hostel room pantry cupboard"
                  className="w-full px-3 py-2 bg-white text-brand-black text-xs font-medium border-2 border-brand-black rounded shadow-hard-sm"
                />
              </div>
            </div>
          )}

          {/* Urgent Need Flag */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 accent-brand-black rounded border-2 border-brand-black"
              />
              <span className="text-xs font-black uppercase text-brand-urgent flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Mark as Urgent Notice (Approaching semester exam or quick handover)
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: Resource Image Upload & Live Preview */}
        <div className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
          <h3 className="font-heading font-black text-base uppercase text-brand-black border-b-2 border-brand-black pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 stroke-[2.5]" />
            3. Resource Image Upload & Live Preview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Live Preview Box */}
            <div className="relative h-60 bg-brand-paper border-2 border-brand-black rounded-neo overflow-hidden flex items-center justify-center shadow-hard-sm">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Resource Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-black text-white text-[10px] font-mono font-bold uppercase rounded">
                    Live Preview
                  </div>
                  {/* Image Removal Button */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-brand-urgent text-white border-2 border-brand-black rounded shadow-hard-sm hover:bg-red-600 transition"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center p-4">
                  <UploadCloud className="w-10 h-10 text-neutral-400 mx-auto" />
                  <span className="text-xs font-black uppercase text-neutral-600 block mt-1">
                    No image attached
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Upload a file or pick from campus presets below
                  </span>
                </div>
              )}
            </div>

            {/* Upload Controls & Presets */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-brand-black">
                Upload Custom Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full text-xs font-bold text-neutral-800 file:mr-3 file:py-2 file:px-3 file:border-2 file:border-brand-black file:rounded file:text-xs file:font-black file:uppercase file:bg-brand-chartreuse file:text-brand-black file:shadow-hard-sm hover:file:bg-yellow-300 cursor-pointer"
              />

              <div className="pt-2">
                <p className="text-[11px] font-black uppercase text-neutral-600 mb-1.5 font-mono">
                  Or select a standard campus category image:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_PHOTOS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImagePreview(p.url)}
                      className={`px-2.5 py-1 text-[11px] font-bold border border-brand-black rounded transition ${
                        imagePreview === p.url
                          ? 'bg-brand-chartreuse text-brand-black font-black'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Other Information & Campus Location */}
        <div className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
          <h3 className="font-heading font-black text-base uppercase text-brand-black border-b-2 border-brand-black pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 stroke-[2.5]" />
            4. Campus Handover & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Community */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Campus / Faculty Community: <span className="text-brand-urgent">*</span>
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2 bg-brand-bg text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm"
              >
                {COMMUNITIES.filter(c => c !== 'All Communities').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Location */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Pickup Location & Safe Handover Spot: <span className="text-brand-urgent">*</span>
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => {
                  setPickupLocation(e.target.value);
                  if (errors.pickupLocation) setErrors(prev => ({ ...prev, pickupLocation: null }));
                }}
                placeholder="e.g. Central Library Ground Floor Lobby or Outside Pharmacy Lab 3"
                className={`w-full px-3 py-2 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                  errors.pickupLocation ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                }`}
              />
              {errors.pickupLocation && (
                <p className="text-xs font-bold text-brand-urgent">{errors.pickupLocation}</p>
              )}
            </div>
          </div>

          {/* Contact Preference */}
          <div className="space-y-1 pt-1">
            <label className="block text-xs font-black uppercase text-brand-black">
              Contact Preference:
            </label>
            <select
              value={contactPreference}
              onChange={(e) => setContactPreference(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 bg-brand-bg text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm"
            >
              <option value="Campus Email (@adtu.edu.in)">Campus Email (@adtu.edu.in)</option>
              <option value="Phone / WhatsApp (+91)">Phone / WhatsApp (+91)</option>
              <option value="Central Library Desk Coordination">Central Library Desk Coordination</option>
              <option value="Hostel Gate Security Reception">Hostel Gate Security Reception</option>
            </select>
          </div>
        </div>

        {/* Buttons: Save as Draft & Pin to Noticeboard */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t-2 border-brand-black">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto px-6 py-3 bg-white text-brand-black font-black text-sm uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm flex items-center justify-center gap-2 hover:bg-neutral-100"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-7 py-3 bg-brand-chartreuse text-brand-black font-black text-sm uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard hover:bg-yellow-300 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            <span>{submitting ? 'Pinning Notice...' : 'Pin to Noticeboard (+35 PTS)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
