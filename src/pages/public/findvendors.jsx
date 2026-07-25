import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  Star,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import apiRequest from "../../services/api.js";

function FindVendors() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({ serviceType: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    apiRequest(`/vendors?${params}`, { auth: false })
      .then((data) => setVendors(data.vendors || []))
      .catch((requestError) => { setVendors([]); setError(requestError.message); })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
     <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
  <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
    <Link to="/" className="text-2xl font-black tracking-tight text-teal-800">
      EventSure
    </Link>

    <div className="hidden items-center gap-8 text-[15px] font-medium text-slate-600 md:flex">
      <Link to="/" className="text-teal-800">
        Home
      </Link>
      <Link to="/how-it-works" className="hover:text-teal-800">
        How It Works
      </Link>
      <Link to="/find-vendors" className="hover:text-teal-700 border-b-2 border-teal-800 pb-1 font-black text-teal-800">
        Find Vendors
      </Link>
      <Link to="/register" className="hover:text-teal-800">
        Become a Vendor
      </Link>
    </div>

    <div className="hidden items-center gap-4 md:flex">
      <Link
        to="/login"
        className="text-sm font-semibold text-slate-700 hover:text-teal-800"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="rounded-full bg-teal-800 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-900/10 hover:bg-teal-900"
      >
        Register
      </Link>
    </div>

    <button
      type="button"
      onClick={() => setMenuOpen((prev) => !prev)}
      className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
    >
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  </nav>

  {menuOpen && (
    <div className="border-t border-slate-100 bg-white px-4 py-5 shadow-xl md:hidden">
      <div className="flex flex-col gap-4 text-sm font-semibold text-slate-700">
        <Link to="/" onClick={() => setMenuOpen(false)} className="text-teal-800">
          Home
        </Link>

        <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>
          How It Works
        </Link>

        <Link to="/find-vendors" onClick={() => setMenuOpen(false)}>
          Find Vendors
        </Link>

        <Link to="/register" onClick={() => setMenuOpen(false)}>
          Become a Vendor
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-slate-200 px-5 py-3 text-center"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-teal-800 px-5 py-3 text-center text-white"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )}
</header>

      <main className="pt-20">
        <section className="px-4 py-10 sm:px-6 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link to="/" className="hover:text-teal-800">Home</Link>
              <span>›</span>
              <span className="font-black text-slate-800">Find Vendors</span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Find the Best Vendors for Your Event
            </h1>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <FilterGroup title="Categories">
                {["Catering", "Decoration", "Hall Booking", "Drinks Supply", "Photography"].map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={filters.serviceType === item}
                      onChange={() => setFilters((current) => ({ ...current, serviceType: current.serviceType === item ? "" : item }))}
                      className="size-5 rounded border-slate-300 accent-teal-800"
                    />
                    {item}
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Price Range">
                <input type="range" className="w-full accent-teal-800" />
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>₦0</span>
                  <span>Any budget</span>
                </div>
              </FilterGroup>

              <FilterGroup title="Location">
                <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3">
                  <MapPin size={18} className="text-teal-800" />
                  <input
                    type="text"
                    placeholder="Enter city or area"
                    value={filters.location}
                    onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </FilterGroup>

              <FilterGroup title="Minimum Rating">
                <div className="grid grid-cols-3 gap-3">
                  {["4.0+", "4.5+", "4.8+"].map((rating) => (
                    <button
                      key={rating}
                      className={`rounded-xl px-3 py-3 text-sm font-black ${
                        rating === "4.5+"
                          ? "bg-teal-800 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </aside>

            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-700">
                  <strong>{vendors.length}</strong> verified vendor{vendors.length === 1 ? "" : "s"} found
                </p>

                <label className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm sm:w-fit sm:gap-5">
                  <span className="text-sm text-slate-600">Sort by:</span>
                  <select className="bg-transparent font-black outline-none">
                    <option>Most Popular</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                  </select>
                </label>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {loading && <p className="text-slate-500" aria-live="polite">Loading vendors…</p>}
                {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
                {!loading && !error && vendors.length === 0 && <p className="rounded-xl bg-white p-6 text-slate-600">No vendors match these filters yet.</p>}
                {vendors.map((vendor) => (
                  <VendorCard key={vendor._id} vendor={vendor} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-teal-800">
              EventSure
            </h3>
            <p className="mt-5 max-w-xs leading-7 text-slate-500">
              Curating editorial excellence for premium event marketplaces globally.
            </p>
          </div>

          <FooterColumn title="Marketplace" links={[["Find Vendors", "/find-vendors"], ["How It Works", "/how-it-works"], ["Vendor Support", "/contact"]]} />
          <FooterColumn title="Company" links={[["Home", "/"], ["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms-and-conditions"]]} />
          <FooterColumn title="Connect" links={[["Contact Us", "/contact"], ["Become a Vendor", "/register"], ["Sign In", "/login"]]} />
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-5 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 EventSure. Editorial excellence for premium events.</p>
          <div className="flex gap-4 text-teal-800">
            <span>🌐</span>
            <span>✣</span>
            <span>RSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FilterGroup = ({ title, children }) => (
  <div className="border-b border-slate-100 py-6 last:border-b-0">
    <h2 className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const VendorCard = ({ vendor }) => (
  <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
    <div className="relative">
      <img
        src={vendor.coverImage || vendor.logo || "/image1.png"}
        alt={`${vendor.businessName} portfolio`}
        className="h-64 w-full object-cover sm:h-72"
      />

      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <Badge label="Verified" />
        {vendor.isSpotlight && <Badge label="Spotlight" dark />}
      </div>

      <button className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
        <Heart size={22} />
      </button>
    </div>

    <div className="p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-black">{vendor.businessName}</h3>
        <div className="flex items-center gap-1 font-black">
          <Star size={18} className="text-orange-700" />
          {vendor.rating}
        </div>
      </div>

      <p className="mt-4 min-h-[52px] leading-7 text-slate-600">
        {vendor.description}
      </p>

      <div className="mt-7 border-t border-slate-100 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Starting From
            </p>
            <p className="mt-1 text-2xl font-black">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(vendor.startingPrice || 0)}</p>
          </div>

          <Link
            to={`/vendors/${vendor._id}`}
            className="rounded-xl bg-slate-100 px-6 py-3 text-center font-black text-teal-800 hover:bg-teal-800 hover:text-white"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Badge = ({ label, dark }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${
      dark ? "bg-teal-800 text-white" : "bg-white text-teal-800"
    }`}
  >
    {!dark && <BadgeCheck size={13} />}
    {label}
  </span>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
    <div className="mt-5 space-y-4 text-slate-500">
      {links.map(([label, path]) => (
        <Link key={path} to={path} className="block hover:text-teal-800">
          {label}
        </Link>
      ))}
    </div>
  </div>
);

export default FindVendors;
