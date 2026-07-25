import { apiFetch } from "../../services/api.js";
import { useState } from "react";
import {
  Search,
  HelpCircle,
  Grid3X3,
  AlertTriangle,
  CalendarDays,
  Heart,
  Mail,
  WalletCards,
  Trash2,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const AccountDeletion = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    reason: "",
    feedback: "",
    password: "",
    confirmed: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmed) {
      alert("Please confirm that you understand the deletion terms.");
      return;
    }

    if (!formData.password) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/users/delete-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit deletion request");
      }

      alert("Account deletion request submitted successfully.");
    } catch (error) {
      alert(error.message || "Unable to submit deletion request.");
    } finally {
      setLoading(false);
    }
  };

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

          <div className="hidden w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search settings or vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-4 sm:gap-5">
            <span className="hidden items-center gap-2 text-sm font-bold text-slate-700 sm:flex">
              <HelpCircle size={18} />
              Support
            </span>

            <Grid3X3 size={20} className="text-slate-700" />

            <button className="hidden rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold sm:block">
              Logout
            </button>
          </div>
        </header>

        <section className="grid min-w-0 gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-black sm:text-4xl">
              Account Privacy & Security
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your personal data and account lifecycle.
            </p>

            <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:mt-10 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <AlertTriangle size={28} />
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-xl font-black sm:text-2xl">
                    Delete Account Request
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    You are requesting to permanently delete your EventSure
                    account. This action is{" "}
                    <span className="font-black text-red-600">
                      final and irreversible.
                    </span>{" "}
                    Once processed, your digital identity, portfolio, and
                    historical data will be purged from our servers.
                  </p>

                  <span className="mt-5 inline-block rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700">
                    30-Day Recovery Window Only
                  </span>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl bg-slate-100 p-5 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                Data Loss Summary
              </p>

              <div className="mt-6 grid min-w-0 gap-5 md:grid-cols-2">
                <LossCard
                  icon={<CalendarDays />}
                  title="Booking History"
                  text="All past invoices and contracts."
                />
                <LossCard
                  icon={<Heart />}
                  title="Saved Vendors"
                  text="Your curated list of premium vendors."
                />
                <LossCard
                  icon={<Mail />}
                  title="Message Archives"
                  text="Correspondence with event staff."
                />
                <LossCard
                  icon={<WalletCards />}
                  title="Financial Records"
                  text="Tax summaries and payment receipts."
                />
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8"
            >
              <div className="min-w-0">
                <label className="text-sm font-black">
                  Why are you leaving us?
                </label>

                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700 sm:px-5 sm:text-base"
                >
                  <option value="">Select a reason...</option>
                  <option value="no_longer_needed">No longer needed</option>
                  <option value="privacy_concern">Privacy concern</option>
                  <option value="poor_experience">Poor experience</option>
                  <option value="duplicate_account">Duplicate account</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows="6"
                placeholder="Optional: Tell us more about your experience..."
                className="mt-5 w-full resize-none rounded-lg bg-slate-100 px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700 sm:px-5 sm:text-base"
              />

              <label className="mt-6 flex items-start gap-4 text-sm leading-6">
                <input
                  type="checkbox"
                  name="confirmed"
                  checked={formData.confirmed}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 shrink-0 accent-teal-700"
                />
                <span className="break-words">
                  I understand that this action cannot be undone and all my data
                  will be permanently purged from EventSure after 30 days. I
                  have downloaded any necessary financial documents.
                </span>
              </label>

              <div className="mt-8 rounded-xl border border-red-200 bg-red-50/40 p-5 sm:p-6">
                <label className="text-sm font-black">
                  Confirm Deletion with Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="mt-4 w-full rounded-lg bg-white px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-red-500 sm:px-5 sm:text-base"
                />
              </div>

              <div className="mt-8 flex flex-col-reverse gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-800"
                  onClick={() => window.history.back()}
                >
                  Keep My Account
                </button>

                <button
                  disabled={loading}
                  className="flex items-center justify-center gap-3 rounded-xl bg-red-700 px-6 py-4 text-sm font-black text-white shadow-xl shadow-red-900/20 hover:bg-red-800 disabled:opacity-70 sm:px-8 sm:text-base"
                >
                  <Trash2 size={18} />
                  {loading ? "Submitting..." : "Submit Deletion Request"}
                </button>
              </div>
            </form>
          </div>

          <aside className="min-w-0 space-y-8">
            <section className="rounded-2xl bg-slate-200 p-5 sm:p-8">
              <h2 className="text-xl font-black">Deletion Timeline</h2>

              <div className="mt-7 space-y-8">
                <TimelineItem
                  number="01"
                  title="Request Submitted"
                  text="Your account is immediately restricted to read-only access."
                  active
                />
                <TimelineItem
                  number="02"
                  title="30-Day Grace Period"
                  text="Change your mind? Simply log in within 30 days to cancel the request."
                />
                <TimelineItem
                  number="03"
                  title="Permanent Erasure"
                  text="All database records, cloud backups, and media files are deleted forever."
                  danger
                />
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <div className="h-20 w-20 overflow-hidden rounded-xl shadow-xl sm:-mt-14 sm:h-24 sm:w-24">
                <img
                  src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&auto=format&fit=crop"
                  alt="Support"
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="mt-6 break-words text-xl font-black sm:mt-8">
                Need a Personal Touch?
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Before you go, would you like to speak with an EventSure
                Specialist? We might be able to help tailor your experience or
                resolve any technical hurdles you have faced.
              </p>

              <button className="mt-6 font-black text-teal-800 underline">
                Chat with Support
              </button>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

const LossCard = ({ icon, title, text }) => {
  return (
    <div className="min-w-0 rounded-xl border-l-4 border-teal-800 bg-white p-5">
      <div className="flex items-center gap-4">
        <span className="shrink-0 text-teal-800">{icon}</span>
        <div className="min-w-0">
          <h3 className="break-words font-black">{title}</h3>
          <p className="break-words text-sm text-slate-500">{text}</p>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ number, title, text, active, danger }) => {
  return (
    <div className="flex gap-4">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
          danger
            ? "bg-red-100 text-red-700"
            : active
            ? "bg-teal-800 text-white"
            : "bg-slate-300 text-slate-600"
        }`}
      >
        {number}
      </span>

      <div className="min-w-0">
        <h3 className="break-words font-black">{title}</h3>
        <p className="mt-1 break-words text-sm leading-5 text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
};

export default AccountDeletion;