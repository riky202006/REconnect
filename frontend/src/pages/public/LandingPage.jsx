import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { NoticeBoardHero } from '../../components/noticeboard/NoticeBoardHero';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { ResourceDetailsModal } from '../../components/resources/ResourceDetailsModal';
import { RequestResourceModal } from '../../components/resources/RequestResourceModal';
import { CategoryBadge, SharingTypeBadge } from '../../components/common/CategoryBadge';
import { StampBadge } from '../../components/common/StatusBadge';
import { useResources } from '../../context/ResourceContext';
import {
  Sparkles,
  ArrowRight,
  PlusCircle,
  Compass,
  CheckCircle2,
  Users,
  Repeat,
  Leaf,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  Clock,
  MapPin,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';

export const LandingPage = () => {
  const { resources } = useResources();
  const [selectedResource, setSelectedResource] = useState(null);
  const [requestingResource, setRequestingResource] = useState(null);
  const navigate = useNavigate();

  // Featured 3 resources
  const featuredResources = resources.slice(0, 3);

  // Recently shared / handed over resources
  const recentlySharedResources = [
    {
      id: 'recent_1',
      title: 'Prestige 1.5L Stainless Steel Electric Kettle',
      category: 'Hostel & Living',
      sharingType: 'DONATE',
      condition: 'Good (Functional)',
      status: 'CLAIMED',
      location: 'Boys Hostel Block 2',
      giver: 'Bikash Gogoi',
      receiver: 'Priyam Sharma',
      date: 'Handed over 2 days ago',
      points: '+50 RePoints',
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=400&q=80',
      note: 'Boils water perfectly, clean interior.'
    },
    {
      id: 'recent_2',
      title: 'Data Structures and Algorithms in C++ (Horowitz)',
      category: 'Textbooks & Notes',
      sharingType: 'DONATE',
      condition: 'Like New',
      status: 'CLAIMED',
      location: 'Central Library Foyer',
      giver: 'Priyam Sharma',
      receiver: 'Riya Sen (2nd Year CSE)',
      date: 'Handed over 4 days ago',
      points: '+50 RePoints',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      note: 'Full syllabus covered with handwritten summary notes.'
    },
    {
      id: 'recent_3',
      title: 'Casio Scientific Calculator FX-991EX',
      category: 'Electronics & Gadgets',
      sharingType: 'EXCHANGE',
      condition: 'Excellent',
      status: 'CLAIMED',
      location: 'Engineering Room E-204',
      giver: 'Rohan Bordoloi',
      receiver: 'Kallol Barman',
      date: 'Handed over 5 days ago',
      points: '+40 RePoints',
      image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80',
      note: 'Swapped for Python reference handbook.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b-3 border-brand-black overflow-hidden">
        {/* Background Decorative Paper Tape Elements */}
        <div className="absolute top-6 left-8 w-28 h-6 tape-strip -rotate-6 hidden lg:block pointer-events-none" />
        <div className="absolute top-20 right-12 w-32 h-6 tape-strip rotate-3 hidden lg:block pointer-events-none" />
        <div className="absolute bottom-10 left-16 w-24 h-5 tape-strip rotate-12 hidden lg:block pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Tagline Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-chartreuse border-2 border-brand-black rounded shadow-hard-sm rotate-[-1deg]">
            <Sparkles className="w-4 h-4 text-brand-black fill-brand-black" />
            <span className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-brand-black">
              Give More. Waste Less. Connect Better.
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-brand-black font-heading tracking-tight leading-[0.95] uppercase max-w-4xl mx-auto">
            YOUR UNUSED THINGS CAN BECOME SOMEONE'S NEW BEGINNING.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-800 font-medium max-w-2xl mx-auto leading-relaxed">
            Pin what you don't need. Find what you do. Join a community where resources get a second life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              to="/resources/share"
              className="w-full sm:w-auto px-7 py-3.5 bg-brand-chartreuse text-brand-black font-black text-base uppercase tracking-wider border-3 border-brand-black rounded brutal-btn shadow-hard flex items-center justify-center gap-2 hover:bg-yellow-300"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>Start Sharing</span>
            </Link>

            <Link
              to="/resources"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-brand-black font-black text-base uppercase tracking-wider border-3 border-brand-black rounded brutal-btn shadow-hard flex items-center justify-center gap-2 hover:bg-neutral-100"
            >
              <Compass className="w-5 h-5 stroke-[2.5]" />
              <span>Explore Resources</span>
            </Link>
          </div>

          {/* Campus Tag Pill */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-bold text-neutral-700">
            <span className="flex items-center gap-1 font-mono">
              🏛️ Assam Down Town University (ADTU)
            </span>
            <span>•</span>
            <span className="font-hand text-lg text-brand-black font-bold">Panikhaiti Campus Hub</span>
          </div>
        </div>

        {/* Physical Noticeboard Visual with Pinned Resource Cards & Perforated Tear-off Stubs */}
        <NoticeBoardHero />
      </section>

      {/* 2. Community Impact Statistics Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-brand-chartreuse border-b-3 border-brand-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-brand-black text-white px-2.5 py-1 rounded inline-block">
              MEASURABLE CAMPUS SUSTAINABILITY
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white border-2 border-brand-black p-4 rounded-neo shadow-hard text-center">
              <span className="font-heading font-black text-3xl sm:text-4xl text-brand-black block">
                580+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-1 block">
                Resources Listed
              </span>
            </div>

            <div className="bg-white border-2 border-brand-black p-4 rounded-neo shadow-hard text-center">
              <span className="font-heading font-black text-3xl sm:text-4xl text-brand-black block">
                412
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-1 block">
                Items Re-Homed
              </span>
            </div>

            <div className="bg-white border-2 border-brand-black p-4 rounded-neo shadow-hard text-center">
              <span className="font-heading font-black text-3xl sm:text-4xl text-brand-black block">
                1.2 Tons
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-1 block">
                CO2 Waste Diverted
              </span>
            </div>

            <div className="bg-white border-2 border-brand-black p-4 rounded-neo shadow-hard text-center">
              <span className="font-heading font-black text-3xl sm:text-4xl text-brand-black block">
                1,420
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-1 block">
                Campus Members
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How ReConnect Works (Exact 3 Steps) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b-3 border-brand-black bg-brand-paper/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-white border border-brand-black rounded text-xs font-mono font-bold uppercase text-brand-black shadow-hard-sm">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-black uppercase font-heading">
              How ReConnect Works
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 font-medium">
              A physical community noticeboard digitized for campus safety, verified student peer trust, and zero waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative bg-white border-2 border-brand-black p-6 rounded-neo shadow-hard-card flex flex-col justify-between">
              {/* Tape decorative element */}
              <div className="absolute -top-3 left-8 w-16 h-5 tape-strip -rotate-2 pointer-events-none" />
              <div className="space-y-3">
                <div className="w-12 h-12 bg-brand-pink border-2 border-brand-black rounded font-heading font-black text-xl flex items-center justify-center shadow-hard-sm">
                  01
                </div>
                <h3 className="text-xl font-black uppercase font-heading text-brand-black">
                  Pin What You Have
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                  Snap a photo of your extra textbook, unused lab coat, calculator, or hostel gear. Choose <strong>Donate</strong>, <strong>Borrow</strong>, or <strong>Exchange</strong>, and pin it to the board.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-dashed border-brand-black/30 flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>Reward:</span>
                <span className="bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded font-mono font-black">+35 RePoints</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white border-2 border-brand-black p-6 rounded-neo shadow-hard-card flex flex-col justify-between">
              <div className="absolute -top-3 right-8 w-16 h-5 tape-strip rotate-3 pointer-events-none" />
              <div className="space-y-3">
                <div className="w-12 h-12 bg-brand-blue border-2 border-brand-black rounded font-heading font-black text-xl flex items-center justify-center shadow-hard-sm">
                  02
                </div>
                <h3 className="text-xl font-black uppercase font-heading text-brand-black">
                  Connect & Arrange Pickup
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                  Peers tear off a request tab with their campus details. Coordinate directly and agree on a safe campus meetup spot like the Central Library, lab entrance, or hostel lobby.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-dashed border-brand-black/30 flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>Verification:</span>
                <span className="bg-brand-paper px-2 py-0.5 border border-brand-black rounded font-mono font-bold">@adtu.edu.in Only</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white border-2 border-brand-black p-6 rounded-neo shadow-hard-card flex flex-col justify-between">
              <div className="absolute -top-3 left-10 w-16 h-5 tape-strip rotate-1 pointer-events-none" />
              <div className="space-y-3">
                <div className="w-12 h-12 bg-brand-chartreuse border-2 border-brand-black rounded font-heading font-black text-xl flex items-center justify-center shadow-hard-sm">
                  03
                </div>
                <h3 className="text-xl font-black uppercase font-heading text-brand-black">
                  Handover & Earn RePoints
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                  Inspect the resource, hand it over, and mark the notice as completed. Both students earn <strong>+50 RePoints</strong> towards eco-champion badges and cafeteria vouchers!
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-dashed border-brand-black/30 flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>Perk:</span>
                <span className="bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded font-mono font-black">+50 RePoints</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b-3 border-brand-black">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-hand text-xl font-bold text-brand-black block -rotate-1">
                Active campus notices
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-black uppercase font-heading mt-0.5">
                Featured Resources
              </h2>
            </div>

            <Link
              to="/resources"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-paper text-brand-black font-extrabold text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
            >
              <span>Explore All Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onSelect={(item) => setSelectedResource(item)}
                onRequest={(item) => setRequestingResource(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recently Shared Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-paper/30 border-b-3 border-brand-black">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-brand-orange px-2.5 py-0.5 border border-brand-black rounded inline-block">
                VERIFIED CAMPUS SUCCESSES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-black uppercase font-heading mt-1">
                Recently Shared Resources
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                Real student items that found a second life instead of ending up in Guwahati landfills.
              </p>
            </div>

            <Link
              to="/dashboard/transactions"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-brand-black font-extrabold text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
            >
              <span>View Exchange Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlySharedResources.map((item) => (
              <div
                key={item.id}
                className="relative bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-5 space-y-4 overflow-hidden"
              >
                {/* Physical Stamp Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <StampBadge status="CLAIMED" />
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover border-2 border-brand-black rounded"
                  />
                  <div className="min-w-0 pr-12">
                    <span className="text-[10px] font-mono font-black uppercase bg-brand-paper px-1.5 py-0.5 border border-brand-black rounded">
                      {item.sharingType}
                    </span>
                    <h4 className="font-heading font-black text-sm text-brand-black uppercase leading-snug mt-1 line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="text-xs text-neutral-700 bg-brand-paper/50 p-2.5 rounded border border-brand-black/20 italic">
                  "{item.note}"
                </div>

                <div className="space-y-1.5 text-xs text-neutral-800 font-medium pt-1 border-t border-brand-black/10">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-bold">Passed By:</span>
                    <span className="font-bold text-brand-black">{item.giver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-bold">Received By:</span>
                    <span className="font-bold text-brand-black">{item.receiver}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-600 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-brand-urgent" />
                      {item.location}
                    </span>
                    <span className="font-heading font-black text-brand-black bg-brand-chartreuse px-1.5 py-0.5 border border-brand-black rounded">
                      {item.points}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call-to-Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-black text-white border-b-3 border-brand-black relative overflow-hidden">
        {/* Decorative Tape and Paper accent */}
        <div className="absolute top-4 right-10 w-32 h-6 bg-brand-chartreuse/80 border border-black rotate-3 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-brand-chartreuse text-brand-black font-mono font-black text-xs uppercase rounded">
            JOIN 1,420+ ADTU STUDENTS & FACULTY
          </span>

          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight uppercase">
            Have Textbooks Or Lab Gear Collecting Dust?
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium max-w-xl mx-auto leading-relaxed">
            Don't let valuable campus resources go to waste after semester exams. Pin them to ReConnect in 60 seconds and give someone their new beginning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/resources/share"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-chartreuse text-brand-black font-black text-sm uppercase tracking-wider border-2 border-white rounded brutal-btn shadow-[3px_3px_0px_#ffffff] hover:bg-yellow-300 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Pin a Resource Now</span>
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white font-black text-sm uppercase tracking-wider border-2 border-white rounded brutal-btn shadow-[3px_3px_0px_#ffffff] hover:bg-white hover:text-brand-black flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 stroke-[2.5]" />
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onRequest={(item) => {
          setSelectedResource(null);
          setRequestingResource(item);
        }}
      />

      <RequestResourceModal
        resource={requestingResource}
        isOpen={!!requestingResource}
        onClose={() => setRequestingResource(null)}
      />

      <Footer />
    </div>
  );
};
