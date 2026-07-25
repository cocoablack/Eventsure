import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  NotebookPen,
  Shield,
  MailIcon,
  ListCheck,
  DollarSign,
  Check,
  ArrowRight,
  Store,
  BadgeCheck,
} from "lucide-react";

import img19 from "../../assets/images/image19.png";
import img20 from "../../assets/images/image20.png";

function HowItWorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-2xl font-black tracking-tight text-teal-800">
            EventSure
          </Link>

          <div className="hidden items-center gap-8 text-[15px] font-medium text-slate-600 md:flex">
            <Link to="/" className="hover:text-teal-800">Home</Link>
            <Link to="/how-it-works" className="hover:text-teal-700 border-b-2 border-teal-800 pb-1 font-black text-teal-800">How It Works</Link>
            <Link to="/find-vendors" className="hover:text-teal-800">Find Vendors</Link>
            <Link to="/register" className="hover:text-teal-800">Become a Vendor</Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-teal-800">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-teal-800 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-900/10 hover:bg-teal-900">
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
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className="text-teal-800">How It Works</Link>
              <Link to="/find-vendors" onClick={() => setMenuOpen(false)}>Find Vendors</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Become a Vendor</Link>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-slate-200 px-5 py-3 text-center">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-full bg-teal-800 px-5 py-3 text-center text-white">
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-800">
                Platform Guide
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                How EventSure Works
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                We bridge the gap between visionary planners and world-class vendors.
                Our secure marketplace ensures quality, transparency, and peace of
                mind for every event detail.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="rounded-xl bg-teal-800 px-6 py-3 text-center font-black text-white shadow-lg shadow-teal-900/20 hover:bg-teal-900">
                  Get Started Now
                </Link>
                <Link to="/find-vendors" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center font-black text-slate-700 hover:text-teal-800">
                  View Marketplace
                </Link>
              </div>
            </div>

            <img
              src={img19}
              alt="EventSure platform guide"
              className="h-72 w-full rounded-3xl object-cover shadow-2xl sm:h-96 lg:h-[450px]"
            />
          </div>
        </section>

        <section className="bg-slate-100 px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle eyebrow="For Event Planners" title="Bring Your Vision to Life" />

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StepCard icon={<NotebookPen />} title="1. Create Request" text="Tell us what you need, from catering to AV. Specify your requirements in detail." />
            <StepCard icon={<DollarSign />} title="2. Set Budget" text="Define your financial boundaries. We match you with vendors who fit your range." />
            <StepCard icon={<MailIcon />} title="3. Receive Offers" text="Top-tier vendors send tailored proposals directly to your dashboard." />
            <StepCard icon={<Shield />} title="4. Pay Securely" text="Our 30/70 model protects you: 30% upfront, 70% only after full completion." />
            <StepCard icon={<ListCheck />} title="5. Track Progress" text="Real-time updates and milestone tracking keep you in control of the timeline." />
            <StepCard icon={<Check />} title="6. Confirm Completion" text="The event is a success. Release the final payment and leave a review." />
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-800">
                For Event Vendors
              </p>

              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
                Scale Your Business With Verified Leads
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
                Join an exclusive network of high-performing vendors. We handle
                discovery, secure payments, and premium client matching so you can
                focus on your craft.
              </p>

              <img
                src={img20}
                alt="Vendor workflow"
                className="mt-8 h-72 w-full rounded-3xl object-cover shadow-xl sm:h-96"
              />
            </div>

            <div className="space-y-6">
              {vendorSteps.map((step) => (
                <TimelineStep key={step.number} {...step} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-100 px-4 py-16 sm:px-6 lg:py-24">
          <SectionTitle eyebrow="Transparency" title="Clear Fees. No Surprises." />

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
            <PricingCard
              title="Service Fees"
              rows={[
                ["Planner Fee", "5% per booking"],
                ["Vendor Commission", "10% per booking"],
                ["Dispute Resolution", "Free"],
              ]}
            />

            <PricingCard
              highlighted
              title="Vendor Subscriptions"
              rows={[
                ["Basic Listing", "Free"],
                ["Starter", "Free"],
                ["Paid plans", "Billing coming later"],
              ]}
            />

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-black">Spotlight Features</h3>

              <p className="mt-5 leading-7 text-slate-600">
                Verified vendors can purchase spotlight placement to appear at the
                top of search results.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>• Only 3 slots available per category.</li>
                <li>• Rotates weekly.</li>
                <li>• Requires 4.5+ average rating.</li>
              </ul>

              <Link to="/register" className="mt-8 block rounded-xl border border-teal-800 px-5 py-3 text-center font-black text-teal-800 hover:bg-teal-800 hover:text-white">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 text-center sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">
              Ready to transform your event experience?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600">
              Join the premium ecosystem where quality meets efficiency. Sign up
              today and start your journey.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/login" className="rounded-xl bg-teal-800 px-8 py-4 font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900">
                Start Planning Your Event
              </Link>

              <Link to="/register" className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-black text-slate-700 hover:text-teal-800">
                Join as Vendor
              </Link>
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

const SectionTitle = ({ eyebrow, title }) => (
  <div className="text-center">
    <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-800">
      {eyebrow}
    </p>
    <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
  </div>
);

const StepCard = ({ icon, title, text }) => (
  <div className="rounded-3xl bg-white p-8 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
      {icon}
    </div>
    <h3 className="mt-6 text-lg font-black">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
  </div>
);

const TimelineStep = ({ number, title, text }) => (
  <div className="flex gap-5">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-teal-800 bg-white text-sm font-black text-teal-800">
      {number}
    </div>

    <div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  </div>
);

const PricingCard = ({ title, rows, highlighted }) => (
  <div
    className={`rounded-3xl bg-white p-8 shadow-sm ${
      highlighted ? "border-t-4 border-teal-800" : ""
    }`}
  >
    <h3 className="text-xl font-black">{title}</h3>

    <div className="mt-7 space-y-5">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <span className="text-sm text-slate-600">{label}</span>
          <span className="text-sm font-black text-teal-800">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const vendorSteps = [
  {
    number: "01",
    title: "Register Account",
    text: "Create your professional profile and showcase your portfolio to thousands of planners.",
  },
  {
    number: "02",
    title: "Complete KYC",
    text: "Submit your business credentials and identity verification for platform security.",
  },
  {
    number: "03",
    title: "Get Verified",
    text: "Once approved, receive your Verified Vendor badge to boost trust and visibility.",
  },
  {
    number: "04",
    title: "Receive Requests",
    text: "Get notified about event requests that match your expertise and location.",
  },
  {
    number: "05",
    title: "Negotiate Offers",
    text: "Communicate directly with planners to refine details and close the deal.",
  },
  {
    number: "06",
    title: "Get Paid in Stages",
    text: "Receive payment updates only after the configured provider verifies the transaction.",
  },
];

export default HowItWorksPage;
