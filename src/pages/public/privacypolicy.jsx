import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MailIcon,
  MapPin,
  User,
  Briefcase,
  CalendarCheck,
  ShieldCheck,
  Cookie,
  Lock,
  Database,
} from "lucide-react";

function PrivacyPolicy() {
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
            <Link to="/how-it-works" className="hover:text-teal-800">How It Works</Link>
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
              <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
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
        <section className="px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-800">
              Legal Document
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              We take your privacy seriously. This document outlines how
              EventSure collects, uses, and protects your information when you
              use our premium marketplace.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <h2 className="font-black text-teal-800">Legal Center</h2>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">
                Last updated Oct 2023
              </p>

              <nav className="mt-6 space-y-2 text-sm font-semibold text-slate-600">
                <PolicyNav icon={<ShieldCheck size={16} />} label="Introduction" active />
                <PolicyNav icon={<Database size={16} />} label="Data Collection" />
                <PolicyNav icon={<Cookie size={16} />} label="Cookie Policy" />
                <PolicyNav icon={<EyeIcon size={16} />} label="User Rights" />
                <PolicyNav icon={<Lock size={16} />} label="Security & Storage" />
              </nav>
            </aside>

            <article className="space-y-14">
              <PolicySection title="1. Introduction">
                <p>
                  Welcome to EventSure. Your privacy is paramount to us. This
                  Privacy Policy describes how EventSure collects, uses, and
                  shares your personal information when you visit our website,
                  use our marketplace, or engage with our vendor services.
                </p>

                <p>
                  By using EventSure, you agree to the collection and use of
                  information described in this policy. We aim to handle personal
                  data lawfully and respond to applicable data-rights requests;
                  the laws that apply depend on where EventSure operates and
                  where you use the service.
                </p>
              </PolicySection>

              <PolicySection title="2. Data Collection">
                <p>
                  We collect several different types of information for various
                  purposes to provide and improve our marketplace service to you.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <InfoCard
                    icon={<User />}
                    title="Personal Data"
                    items={[
                      "Full name and contact details",
                      "Email address",
                      "Phone number",
                      "Physical address for billing",
                    ]}
                  />

                  <InfoCard
                    icon={<Briefcase />}
                    title="Vendor Data"
                    items={[
                      "Business name and registration",
                      "Tax identification numbers",
                      "KYC verification documents",
                      "Service portfolio and pricing",
                    ]}
                  />
                </div>
              </PolicySection>

              <PolicySection title="3. How We Use Data">
                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                  <p>
                    The data we collect serves the core functionality of our
                    premium marketplace, specifically:
                  </p>

                  <div className="mt-7 space-y-6">
                    <UseRow
                      icon={<CalendarCheck />}
                      title="Facilitating Bookings"
                      text="Enabling seamless communication and transactions between event planners and high-end vendors."
                    />

                    <UseRow
                      icon={<ShieldCheck />}
                      title="KYC & Compliance"
                      text="Verifying the identity of professional vendors to maintain the integrity of our curated ecosystem."
                    />
                  </div>
                </div>
              </PolicySection>

              <PolicySection title="4. Data Sharing">
                <p>
                  We do not sell your personal data. We share your information
                  only with:
                </p>

                <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-600">
                  <li>
                    <strong className="text-slate-800">Vendors:</strong> Limited
                    to what is necessary to fulfill your specific event booking.
                  </li>
                  <li>
                    <strong className="text-slate-800">Payment Processors:</strong>{" "}
                    Payment details needed to process a transaction. EventSure
                    stores the provider reference and transaction status, not
                    full card details.
                  </li>
                  <li>
                    <strong className="text-slate-800">Legal Authorities:</strong>{" "}
                    Only when strictly required by law to protect our rights or
                    user safety.
                  </li>
                </ul>
              </PolicySection>

              <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-black">
                  <Lock size={22} className="text-teal-800" />
                  5. Data Security
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  We hash account passwords, restrict protected API routes by
                  role, rate-limit sensitive endpoints, and keep KYC uploads in
                  authenticated storage. Production deployments should terminate
                  traffic over TLS. No internet service can promise absolute
                  security.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {["Password hashing", "Role-based access", "Rate limiting"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </section>

              <PolicySection title="6. Cookie Policy">
                <p>
                  EventSure uses essential browser storage to maintain an
                  authenticated session and user preferences. We do not currently
                  use advertising cookies. This section will be updated before
                  optional analytics or marketing cookies are introduced.
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="grid grid-cols-[1fr_2fr] bg-slate-100 px-5 py-4 text-xs font-black uppercase tracking-widest text-teal-800">
                    <span>Cookie Type</span>
                    <span>Purpose</span>
                  </div>

                  <CookieRow type="Essential" purpose="Required for platform login and security." />
                  <CookieRow type="Analytics" purpose="Helping us understand how users interact with the marketplace." />
                </div>
              </PolicySection>

              <PolicySection title="7. User Rights">
                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  <RightCard icon={<EyeIcon />} title="Access" text="Request a copy of the personal data we hold." />
                  <RightCard icon={<PencilIcon />} title="Correction" text="Ask us to correct inaccurate or incomplete info." />
                  <RightCard icon={<TrashIcon />} title="Erasure" text="Request deletion of your account and data." />
                </div>
              </PolicySection>

              <PolicySection title="8. Third-Party Services">
                <p>
                  We use selected third-party services to enhance your
                  experience. These partners have their own privacy policies.
                </p>

              </PolicySection>

              <PolicySection title="9. Contact Us">
                <div className="mt-6 rounded-3xl bg-slate-100 p-6 sm:p-8">
                  <p>
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact our Data Protection Officer:
                  </p>

                  <div className="mt-6 space-y-4">
                    <ContactRow icon={<MailIcon />} text="privacy@eventsure.com" />
                    <ContactRow icon={<MapPin />} text="123 Curated Lane, London, W1S 2PH, UK" />
                  </div>
                </div>
              </PolicySection>
            </article>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-teal-800">EventSure</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              2024 EventSure Marketplace. High-end vendor curation for premium
              events.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium text-slate-500 sm:flex-row sm:gap-6">
            <Link to="/terms-and-conditions" className="hover:text-teal-800">Terms and Conditions</Link>
            <Link to="/privacy-policy" className="text-teal-800">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-teal-800">Contact Support</Link>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
      © 2026 EventSure. Secure vendor marketplace.
    </p>
      </footer>
    </div>
  );
}

const PolicyNav = ({ icon, label, active }) => (
  <a
    href={`#${label.toLowerCase().replaceAll(" ", "-")}`}
    className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
      active ? "bg-slate-100 text-teal-800" : "hover:bg-slate-50"
    }`}
  >
    {icon}
    {label}
  </a>
);

const PolicySection = ({ title, children }) => (
  <section>
    <h2 className="text-2xl font-black text-slate-950">{title}</h2>
    <div className="mt-5 space-y-5 leading-8 text-slate-600">{children}</div>
  </section>
);

const InfoCard = ({ icon, title, items }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm">
    <div className="flex items-center gap-3 text-teal-800">
      {icon}
      <h3 className="font-black">{title}</h3>
    </div>

    <ul className="mt-5 space-y-2 text-sm text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const UseRow = ({ icon, title, text }) => (
  <div className="flex gap-4">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800">
      {icon}
    </div>
    <div>
      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  </div>
);

const CookieRow = ({ type, purpose }) => (
  <div className="grid grid-cols-[1fr_2fr] border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
    <strong className="text-slate-800">{type}</strong>
    <span>{purpose}</span>
  </div>
);

const RightCard = ({ icon, title, text }) => (
  <div className="rounded-2xl border-t-4 border-teal-800 bg-white p-6 shadow-sm">
    <div className="text-teal-800">{icon}</div>
    <h3 className="mt-4 font-black">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
  </div>
);

const ContactRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 font-black text-teal-800">
    {icon}
    <span className="break-all">{text}</span>
  </div>
);

export default PrivacyPolicy;
