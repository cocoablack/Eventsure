import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  CheckCircle,
  ShieldCheck,
  Circle,
  TrashIcon,
  NotebookPenIcon,
  HelpCircle,
  FileText,
} from "lucide-react";

function TermsCondition() {
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
              Legal Documentation
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl lg:text-6xl">
              Terms and Conditions
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Welcome to EventSure. These terms govern your use of our premium
              marketplace for event services. Please read them carefully to
              understand your rights and obligations.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm font-medium text-slate-500 sm:flex-row sm:gap-5">
              <span>Last Updated: May 24, 2024</span>
              <span className="hidden sm:block">•</span>
              <span>Effective Date: June 01, 2024</span>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[270px_1fr]">
            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <nav className="space-y-2 text-sm font-semibold text-slate-600">
                {navItems.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 hover:bg-slate-50 hover:text-teal-800 ${
                      index === 7 ? "bg-teal-50 text-teal-800" : ""
                    }`}
                  >
                    {index + 1}. {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 rounded-2xl bg-slate-100 p-5">
                <h3 className="font-black">Need Help?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Questions about these terms? Send a request through our support form.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 font-black text-teal-800"
                >
                  Contact Support
                  <span>→</span>
                </Link>
              </div>
            </aside>

            <article className="space-y-10">
              <section id="intro" className="grid gap-8 xl:grid-cols-[220px_1fr]">
                <h2 className="text-3xl font-black text-teal-800">
                  1. Introduction
                </h2>

                <div className="space-y-5 leading-8 text-slate-600">
                  <p>
                    EventSure acts as a curated digital gallery connecting
                    high-end service providers with event planners and hosts. By
                    accessing our platform, you agree to be bound by these
                    editorial excellence standards.
                  </p>
                  <p>
                    Our goal is to maintain a high-trust environment. These terms
                    ensure that every interaction meets the premium quality
                    expected by our global clientele.
                  </p>
                </div>
              </section>

              <PolicyBlock title="2. User Obligations">
                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                  <div className="space-y-5">
                    <CheckItem text="Users must provide accurate, up-to-date contact and event information during the booking process." />
                    <CheckItem text="Any communication regarding bookings initiated on EventSure must remain on the platform to ensure security and dispute resolution." />
                    <CheckItem text="Users agree to respect the intellectual property of vendors, including portfolio images and custom proposal documents." />
                  </div>
                </div>
              </PolicyBlock>

              <PolicyBlock title="3. Vendor Obligations">
                <p className="leading-8 text-slate-600">
                  Vendors represent the face of EventSure. You are required to
                  keep their availability accurate and fulfill bookings accepted
                  through the system. Deliberate off-platforming of
                  clients discovered via EventSure will result in account
                  suspension.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <MiniCard
                    title="Portfolio Integrity"
                    text="Only original work performed by your studio may be displayed in your gallery."
                  />
                  <MiniCard
                    title="Service Standard"
                    text="You must deliver services exactly as described in the verified booking agreement."
                  />
                </div>
              </PolicyBlock>

              <section id="kyc">
                <h2 className="text-3xl font-black text-teal-800">
                  4. KYC Verification
                </h2>

                <div className="mt-6 rounded-3xl bg-teal-50 p-6 sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-800 text-white">
                      <ShieldCheck size={30} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black">
                        Mandatory Identity Verification
                      </h3>
                      <p className="mt-4 leading-8 text-slate-600">
                        To ensure marketplace safety, all vendors must complete
                        identity verification when requested. Submitted documents
                        are reviewed by an administrator before a verified badge
                        is granted.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <PolicyBlock title="5. Payments">
                <p className="leading-8 text-slate-600">
                  Payment availability depends on the configured payment provider.
                  The current integration verifies transaction status with the
                  provider before a booking is marked paid. EventSure is not an
                  escrow service and does not currently automate vendor payouts.
                </p>

                <div className="mt-8 space-y-8">
                  <TimelineItem
                    active
                    title="Provider checkout"
                    text="The payer completes checkout on the payment provider’s hosted page."
                  />
                  <TimelineItem
                    title="Server verification"
                    text="EventSure records a successful payment only after server-side verification or a valid signed webhook."
                  />
                </div>
              </PolicyBlock>

              <PolicyBlock title="6. Service Fee Deduction">
                <div className="rounded-3xl bg-slate-100 p-6 sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black">
                        Transparent Commission
                      </h3>
                      <p className="mt-1 text-slate-500">
                        Configurable Platform Fee
                      </p>
                    </div>

                    <strong className="text-5xl font-black text-teal-800">
                      —
                    </strong>
                  </div>

                  <p className="mt-6 leading-8 text-slate-600">
                    Any service or processing fee must be shown before checkout.
                    EventSure does not currently provide automated vendor payouts;
                    fee and payout terms must be configured before launch.
                  </p>
                </div>
              </PolicyBlock>

              <PolicyBlock title="7. Spotlight & Subscription Rules">
                <p className="leading-8 text-slate-600">
                  Vendors may opt in for Spotlight placement. Spotlight items
                  must adhere to higher visual quality standards. We reserve the
                  right to remove any listing that does not meet our editorial
                  brand aesthetic.
                </p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 italic leading-8 text-slate-600">
                  Paid subscriptions and paid Spotlight placement are not enabled
                  until verified billing is configured. No paid plan is activated
                  from an unverified client response.
                </div>
              </PolicyBlock>

              <PolicyBlock title="8. Privacy & Data">
                <p className="leading-8 text-slate-600">
                  EventSure applies access controls to personal and KYC data and
                  hashes account passwords. We do not sell personal event data to
                  third-party advertisers. Please refer to our full{" "}
                  <Link to="/privacy-policy" className="font-black text-teal-800">
                    Privacy Policy
                  </Link>{" "}
                  for details about collection, use, retention, and user requests.
                </p>
              </PolicyBlock>

              <PolicyBlock title="9. Deletion & Modification Requests">
                <p className="leading-8 text-slate-600">
                  Users and vendors have the right to request modification or
                  deletion of account data. Upon deletion, transactional records
                  required for tax purposes will be retained for the minimum
                  period mandated by law.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ActionButton icon={<TrashIcon size={18} />} label="Request Data Deletion" />
                  <ActionButton teal icon={<NotebookPenIcon size={18} />} label="Modify Information" />
                </div>
              </PolicyBlock>
            </article>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-teal-800">EventSure</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              © 2024 EventSure. Editorial excellence in event planning.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium text-slate-500 sm:flex-row sm:gap-6">
            <Link to="/terms-and-conditions" className="text-teal-800">Terms and Conditions</Link>
            <Link to="/privacy-policy" className="hover:text-teal-800">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-teal-800">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const PolicyBlock = ({ title, children }) => (
  <section>
    <h2 className="text-3xl font-black text-teal-800">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
);

const CheckItem = ({ text }) => (
  <div className="flex gap-4">
    <CheckCircle size={22} className="mt-1 shrink-0 text-teal-800" />
    <p className="leading-7 text-slate-600">{text}</p>
  </div>
);

const MiniCard = ({ title, text }) => (
  <div className="rounded-2xl bg-slate-100 p-6">
    <h3 className="font-black">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
  </div>
);

const TimelineItem = ({ active, title, text }) => (
  <div className="flex gap-5">
    <Circle
      size={20}
      className={`mt-1 shrink-0 rounded-full ${
        active ? "fill-teal-800 text-teal-800" : "fill-slate-300 text-slate-300"
      }`}
    />

    <div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 leading-7 text-slate-600">{text}</p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, teal }) => (
  <button
    className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 font-black ${
      teal
        ? "bg-teal-50 text-teal-800"
        : "bg-slate-100 text-slate-800"
    }`}
  >
    {icon}
    {label}
  </button>
);

const navItems = [
  { label: "Introduction", href: "#intro" },
  { label: "User Obligations", href: "#users" },
  { label: "Vendor Obligations", href: "#vendors" },
  { label: "KYC Verification", href: "#kyc" },
  { label: "Payment Stages", href: "#payments" },
  { label: "Service Fee", href: "#fees" },
  { label: "Spotlight Rules", href: "#spotlight" },
  { label: "Privacy & Data", href: "#privacy" },
  { label: "Modifications", href: "#modifications" },
];

export default TermsCondition;
