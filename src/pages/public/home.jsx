import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ShieldCheck,
  MessageSquare,
  Compass,
  SearchCheck,
  CalendarCheck,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import apiRequest from "../../services/api.js";

import img1 from "../../assets/images/image1.png";
import img9 from "../../assets/images/image9.jpg";
import img10 from "../../assets/images/image10.jpg";
import img11 from "../../assets/images/image11.jpg";
import img12 from "../../assets/images/image12.png";
import img13 from "../../assets/images/image13.png";

const categories = [
  { title: "Catering", image: img10 },
  { title: "Hall Booking", image: img12 },
  { title: "Decoration", image: img9 },
  { title: "Drink Supply", image: img13 },
  { title: "Sound & Lighting", image: img11 },
  { title: "Photography", image: img1 },
  { title: "Rentals", image: img12 },
];

const resources = [
  {
    tag: "GUIDE",
    title: "10 Secrets to a Stress-Free Wedding Budget",
    image: img9,
  },
  {
    tag: "CATERING",
    title: "Choosing the Perfect Menu for Corporate Galas",
    image: img10,
  },
  {
    tag: "PRODUCTION",
    title: "Lighting Trends That Will Transform Your Venue",
    image: img11,
  },
];

function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    apiRequest("/vendors/spotlight", { auth: false })
      .then((data) => setVendors(data.spotlightVendors || []))
      .catch(() => setVendors([]));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
     <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
  <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
    <Link to="/" className="text-2xl font-black tracking-tight text-teal-800">
      EventSure
    </Link>

    <div className="hidden items-center gap-8 text-[15px] font-medium text-slate-600 md:flex">
      <Link to="/" className="hover:text-teal-700 border-b-2 border-teal-800 pb-1 font-black text-teal-800">
        Home
      </Link>
      <Link to="/how-it-works" className="hover:text-teal-800">
        How It Works
      </Link>
      <Link to="/find-vendors" className="hover:text-teal-800">
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
        <Link to="/" onClick={() => setMenuOpen(false)} className="text-teal-800 ">
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
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-teal-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-teal-800">
              Secure Marketplace
            </span>

            <h2 className="mt-6 max-w-xl text-5xl font-black leading-tight md:text-6xl">
              Your Dream Event,{" "}
              <span className="italic text-teal-800">
                Verified & Secured.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-slate-600">
              Find and book trusted event vendors for catering, decoration, and
              more with our secure 30/70 payment protection.
            </p>

            <div className="mt-8 flex items-center gap-5">
              <Link
                to="/find-vendors"
                className="rounded-xl bg-teal-800 px-6 py-3 font-bold text-white shadow-lg shadow-teal-900/20"
              >
                Find Vendors
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 font-bold text-teal-800"
              >
                Become a Vendor <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={img1}
              alt="Luxury event setup"
              className="h-[560px] w-full rounded-3xl object-cover shadow-2xl"
            />

            {/* <div className="absolute -bottom-5 left-8 rounded-2xl bg-white p-4 shadow-xl">
              <p className="text-xs font-bold">Top Rated Caterer</p>
              <div className="mt-1 flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={15} fill="currentColor" />
                ))}
              </div>
            </div> */}
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-10">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl bg-teal-50 p-8 text-center md:grid-cols-3">
            <Stat value="2,500+" label="Events Successfully Planned" />
            <Stat value="800+" label="Verified Professional Vendors" />
            <Stat value="98%" label="Customer Satisfaction Rate" />
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20">
          <SectionTitle eyebrow="The Difference" title="Why Choose EventSure?" />

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-4">
            <Feature
              icon={<BadgeCheck />}
              title="Rigorous Verification"
              text="Our vendors pass strict background and portfolio checks."
            />
            <Feature
              icon={<ShieldCheck />}
              title="30/70 Escrow Protection"
              text="Funds are protected until services are delivered."
            />
            <Feature
              icon={<MessageSquare />}
              title="Seamless Communication"
              text="Keep event details organized in one secure workspace."
            />
            <Feature
              icon={<Compass />}
              title="Expert Planning Tools"
              text="Use budgeting, guest list, and planning tools."
            />
          </div>
        </section>

        <section className="px-6 py-20">
          <SectionTitle eyebrow="How It Works" title="Simple Event Booking" />

          <div className="mx-auto mt-12 grid max-w-5xl gap-10 text-center md:grid-cols-3">
            <Step
              icon={<SearchCheck />}
              title="Browse Verified Vendors"
              text="Explore vetted professionals with transparent reviews."
            />
            <Step
              icon={<BadgeCheck />}
              title="Secure Booking"
              text="Book with 30/70 payment protection."
            />
            <Step
              icon={<CalendarCheck />}
              title="Success"
              text="Release final payment only after completion."
            />
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-teal-800">
                  Explore Services
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Featured Categories
                </h2>
              </div>

              <Link to="/find-vendors" className="text-sm font-bold text-teal-800">
                View All Categories
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="relative h-44 overflow-hidden rounded-2xl"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  <p className="absolute bottom-4 left-4 font-black text-white">
                    {category.title}
                  </p>
                </div>
              ))}

              <Link
                to="/find-vendors"
                className="flex h-44 items-center justify-center rounded-2xl bg-teal-800 p-8 text-center font-black text-white"
              >
                Browse All 20+ Categories
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-teal-900 px-6 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            <div>
              <span className="rounded-full bg-teal-700 px-4 py-2 text-xs font-black">
                Peace of Mind
              </span>

              <h2 className="mt-6 max-w-xl text-4xl font-black">
                Secure Payments & Verified Quality.
              </h2>

              <div className="mt-8 space-y-6">
                <TrustItem title="Server-verified payment status" />
                <TrustItem title="Admin-reviewed vendor verification" />
              </div>
            </div>

            <div className="rounded-3xl bg-teal-800 p-8 shadow-xl">
              <MoneyRow label="Total Booking Fee" value="₦250,000" />
              <MoneyRow label="Provider Checkout" value="Redirect" teal />
              <div className="my-5 h-2 rounded-full bg-teal-950">
                <div className="h-2 w-[30%] rounded-full bg-teal-300" />
              </div>
              <MoneyRow label="Payment Status" value="Server verified" />
              <div className="my-5 h-2 rounded-full bg-teal-950">
                <div className="h-2 w-[70%] rounded-full bg-teal-300" />
              </div>
              <MoneyRow label="Vendor Payout" value="Not automated" />
            </div>
          </div>
        </section>

        <section id="vendors" className="bg-slate-50 px-6 py-20">
          <SectionTitle eyebrow="Top Performers" title="Spotlight Vendors" />

          {vendors.length ? <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-3">
            {vendors.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)}
          </div> : <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">No Spotlight placements are active. <Link to="/find-vendors" className="font-black text-teal-800">Browse verified vendors</Link>.</div>}
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-teal-800">
                  Learn From The Pros
                </p>
                <h2 className="mt-2 text-3xl font-black">Planning Resources</h2>
              </div>

              <Link to="/how-it-works" className="text-sm font-bold text-teal-800">How EventSure works</Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {resources.map((resource) => (
                <article key={resource.title}>
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="h-52 w-full rounded-2xl object-cover"
                  />
                  <p className="mt-5 text-xs font-black text-teal-800">
                    {resource.tag}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Learn practical event planning strategies from experienced
                    vendors and organizers.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-100 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="max-w-xl text-3xl font-black">
              Trusted by over 2,000+ Event Organizers.
            </h2>
            <p className="mt-3 text-slate-600">
              See how EventSure is transforming the way people plan events.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-2xl bg-white p-7 shadow-sm">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-6 text-slate-600">
                    “The 30/70 payment scheme gave me the confidence to hire a
                    vendor I had not used before. Everything went perfectly.”
                  </p>
                  <h4 className="mt-6 font-black">Sarah Johnson</h4>
                  <p className="text-sm text-slate-500">Wedding Planner</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

<footer className="bg-slate-50 px-6 py-12">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-black text-teal-800">EventSure</h3>
        <p className="mt-3 max-w-md text-sm text-slate-500">
          Premium marketplace for secure event vendor discovery and booking.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:gap-6">
        <Link to="/terms-and-conditions">Terms and Conditions</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/contact">Contact Support</Link>
      </div>
    </div>

    <p className="mt-10 text-center text-xs text-slate-400">
      © 2026 EventSure. Secure vendor marketplace.
    </p>
  </footer>
    </div>
  );
}

const Stat = ({ value, label }) => (
  <div>
    <h3 className="text-3xl font-black text-teal-800">{value}</h3>
    <p className="mt-2 text-sm text-slate-600">{label}</p>
  </div>
);

const SectionTitle = ({ eyebrow, title }) => (
  <div className="text-center">
    <p className="text-xs font-black uppercase tracking-widest text-teal-800">
      {eyebrow}
    </p>
    <h2 className="mt-2 text-3xl font-black">{title}</h2>
  </div>
);

const Feature = ({ icon, title, text }) => (
  <div className="rounded-2xl bg-white p-7 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
      {icon}
    </div>
    <h3 className="mt-6 font-black">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
  </div>
);

const Step = ({ icon, title, text }) => (
  <div>
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-800 shadow-sm">
      {icon}
    </div>
    <h3 className="mt-5 font-black">{title}</h3>
    <p className="mt-2 text-sm text-slate-500">{text}</p>
  </div>
);

const TrustItem = ({ title }) => (
  <div className="flex gap-4">
    <CheckCircle className="mt-1 text-teal-300" />
    <div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-teal-100">
        Every booking and vendor relationship is protected with verified
        processes and secure payment logic.
      </p>
    </div>
  </div>
);

const MoneyRow = ({ label, value, teal }) => (
  <div className="flex items-center justify-between border-b border-teal-700 py-4">
    <span className={teal ? "text-teal-300" : "text-white"}>{label}</span>
    <strong className={teal ? "text-teal-300" : "text-white"}>{value}</strong>
  </div>
);

const VendorCard = ({ vendor }) => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
    <div className="relative">
      <img
        src={vendor.coverImage || vendor.logo || img12}
        alt={vendor.businessName}
        className="h-56 w-full object-cover"
      />
      <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-black">
        ★ {Number(vendor.rating || 0).toFixed(1)}
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black">{vendor.businessName}</h3>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">
          VERIFIED
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-500">{vendor.category}</p>

      <Link to={`/vendors/${vendor._id}`} className="mt-6 block w-full rounded-xl border border-teal-800 px-5 py-3 text-center font-black text-teal-800 hover:bg-teal-800 hover:text-white">
        View Profile
      </Link>
    </div>
  </div>
);

export default Homepage;
