import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  HelpCircle,
  SlidersHorizontal,
  MapPin,
  Filter,
  Star,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";
import { Link } from "react-router-dom";

const BrowseVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [spotlightVendors, setSpotlightVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    serviceType: "",
    location: "",
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams(filters).toString();

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors?${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load vendors");
        }

        setVendors(data.vendors);
        setSpotlightVendors(data.spotlightVendors);
      } catch (error) {
        setVendors([]);
        setSpotlightVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [filters]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Global search for events or vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-4 text-slate-700 sm:gap-5">
            <Mail size={21} />
            <HelpCircle size={21} />

            <button className="hidden rounded-full bg-teal-800 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-900 sm:flex sm:items-center sm:gap-2">
              New Inquiry <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <section className="w-full max-w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl lg:text-4xl">
              Browse Verified Vendors
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base lg:text-lg">
              Connect with the best service providers for your upcoming event.
              Every partner is vetted for excellence.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm sm:mt-10">
            <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
              <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-100 px-4 py-4 sm:px-5">
                <Search size={20} className="shrink-0 text-slate-400" />
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Search by username or service"
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <FilterButton icon={<Filter size={18} />} label="Service Type" />
              <FilterButton icon={<MapPin size={18} />} label="Location" />

              <button className="flex items-center justify-center gap-3 rounded-xl bg-teal-800 px-5 py-4 text-sm font-bold text-white hover:bg-teal-900 sm:text-base">
                <SlidersHorizontal size={20} />
                Advanced Filters
              </button>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black sm:text-2xl">
                Spotlight Vendors
              </h2>
              <button className="w-fit border-b border-teal-800 text-sm font-bold text-teal-800">
                View All Premium Members
              </button>
            </div>

            <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {spotlightVendors.map((vendor, index) => (
                <SpotlightVendorCard
                  key={vendor._id}
                  vendor={vendor}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="border-l-4 border-teal-800 pl-4 text-xl font-black sm:text-2xl">
                Recommended For You
              </h2>

              <div className="flex items-center gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <ChevronLeft size={20} />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid min-w-0 gap-6 sm:grid-cols-2 2xl:grid-cols-4">
              {vendors.map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const FilterButton = ({ icon, label }) => {
  return (
    <button className="flex items-center justify-center gap-3 rounded-xl bg-slate-100 px-5 py-4 text-sm font-bold text-slate-900 hover:bg-slate-200 sm:text-base">
      {icon}
      {label}
    </button>
  );
};

const SpotlightVendorCard = ({ vendor, index }) => {
  return (
    <div
      className={`min-w-0 rounded-[2rem] p-3 sm:p-5 ${
        index === 0
          ? "bg-teal-50"
          : index === 1
          ? "bg-slate-100 xl:mt-12"
          : "bg-orange-50"
      }`}
    >
      <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/70">
        <div className="h-56 bg-gradient-to-br from-teal-100 to-slate-300 sm:h-64">
          {vendor.coverImage && (
            <img
              src={vendor.coverImage}
              alt={vendor.businessName}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex w-fit items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-800">
              <BadgeCheck size={14} />
              Verified Premium
            </span>

            <span className="flex items-center gap-1 text-sm font-bold">
              <Star size={15} className="fill-orange-500 text-orange-500" />
              {vendor.rating}
            </span>
          </div>

          <h3 className="mt-5 break-words text-xl font-black sm:text-2xl">
            {vendor.businessName}
          </h3>
          <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-slate-600">
            {vendor.description}
          </p>

          <Link
            to={`/user/vendors/${vendor._id}`}
            className="mt-7 block w-full rounded-xl bg-teal-800 px-5 py-4 text-center text-sm font-bold text-white hover:bg-teal-900 sm:text-base"
          >
            Explore Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const VendorCard = ({ vendor }) => {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative h-44 bg-gradient-to-br from-teal-100 to-slate-300 sm:h-48">
        {vendor.coverImage && (
          <img
            src={vendor.coverImage}
            alt={vendor.businessName}
            className="h-full w-full object-cover"
          />
        )}

        <span className="absolute right-4 top-4 max-w-[75%] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-800">
          {vendor.category}
        </span>
      </div>

      <div className="min-w-0 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="break-words text-lg font-black sm:text-xl">
            {vendor.businessName}
          </h3>
          <BadgeCheck size={20} className="shrink-0 text-teal-800" />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <Star size={15} className="fill-orange-500 text-orange-500" />
          <span className="font-bold">{vendor.rating}</span>
          <span className="text-slate-500">({vendor.reviewCount} reviews)</span>
        </div>

        <p className="mt-5 min-h-0 break-words text-sm italic leading-6 text-slate-600 sm:min-h-12">
          “{vendor.tagline}”
        </p>

        <div className="mt-6 border-t border-slate-100 pt-5 sm:mt-8 sm:pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Starting At
          </p>
          <h4 className="mt-2 text-2xl font-black text-teal-800">
            ${vendor.startingPrice.toLocaleString()}
          </h4>
        </div>

        <button className="mt-6 w-full rounded-xl bg-teal-800 px-4 py-3 text-sm font-bold text-white hover:bg-teal-900 sm:mt-7">
          Send Booking Request
        </button>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to={`/user/vendors/${vendor._id}`}
            className="rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-bold"
          >
            View Details
          </Link>
          <button className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold">
            Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseVendors;
