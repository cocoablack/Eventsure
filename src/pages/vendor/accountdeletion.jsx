import { apiFetch } from "../../services/api.js";
import { useState } from "react";
import {
  Search,
  AlertTriangle,
  EyeOff,
  CreditCard,
  Sparkles,
  Archive,
  ArrowLeft,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const VendorAccountDeletion = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    feedback: "",
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
      alert("Please confirm that you understand this action is permanent.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/delete-request`,
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

      alert("Vendor account deletion request submitted successfully.");
    } catch (error) {
      alert(error.message || "Unable to submit deletion request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search settings..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            Settings / Account Security
          </p>

          <h1 className="mt-5 text-4xl font-black">Close Vendor Account</h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            We are sorry to see you go. Before you proceed with account closure,
            please review the irreversible implications of this action below.
          </p>

          <section className="mt-10 rounded-2xl border-l-4 border-red-600 bg-red-50 p-7">
            <div className="flex gap-5">
              <AlertTriangle className="shrink-0 text-red-600" size={26} />
              <div>
                <h2 className="text-xl font-black text-red-700">
                  Irreversible Action
                </h2>
                <p className="mt-2 leading-7 text-red-700">
                  Deleting your account is permanent. This will immediately
                  cease all business activities associated with your EventSure
                  vendor profile. Once the process is initiated, you will lose
                  access to your dashboard, client list, and history forever.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
              Consequences of Closure
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <ConsequenceCard
                icon={<EyeOff />}
                title="Loss of Platform Visibility"
                text="Your profile and services will be hidden from all users. Existing search engine results for your EventSure page will eventually return a 404 error, and your vendor rankings will be forfeited."
              />

              <ConsequenceCard
                icon={<CreditCard />}
                title="Subscription Cancellation"
                text="All recurring billing will stop immediately. Please note that no partial refunds are issued for the remainder of your current billing cycle per our standard Vendor Agreement."
              />

              <ConsequenceCard
                icon={<Sparkles />}
                title="Spotlight Removal"
                text="Any active or scheduled spotlight promotions or homepage features will be terminated immediately. These credits cannot be transferred to other accounts or redeemed for cash value."
              />

              <ConsequenceCard
                icon={<Archive />}
                title="Data Retention"
                text="Certain records, including transaction history and tax documentation, will be retained for up to 7 years to ensure compliance with global legal and financial regulations."
              />
            </div>
          </section>

          <form onSubmit={handleSubmit} className="mt-12 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
              Optional Feedback
            </p>

            <div className="mt-7">
              <label className="text-sm font-black">Reason for leaving</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="mt-3 w-full border border-slate-200 bg-slate-100 px-5 py-4 outline-none focus:border-teal-800"
              >
                <option value="">Select a reason</option>
                <option value="no_longer_needed">No longer needed</option>
                <option value="too_expensive">Too expensive</option>
                <option value="low_bookings">Not getting enough bookings</option>
                <option value="moving_platform">Moving to another platform</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="text-sm font-black">
                Anything else you&apos;d like us to know?
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us more about your experience..."
                className="mt-3 w-full resize-none border border-slate-200 bg-slate-100 px-5 py-4 outline-none focus:border-teal-800"
              />
            </div>

            <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <label className="flex items-center gap-4 font-black">
                <input
                  type="checkbox"
                  name="confirmed"
                  checked={formData.confirmed}
                  onChange={handleChange}
                  className="h-5 w-5 accent-red-600"
                />
                I understand that this action is permanent and cannot be undone.
              </label>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  disabled={loading || !formData.confirmed}
                  className="rounded-xl bg-red-700 px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-900/20 hover:bg-red-800 disabled:bg-red-100 disabled:text-red-300"
                >
                  {loading ? "Submitting..." : "Submit Deletion Request"}
                </button>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex items-center gap-3 rounded-xl px-6 py-4 font-black text-slate-800"
                >
                  <ArrowLeft size={18} />
                  Nevermind, keep my account
                </button>
              </div>

              <p className="mt-8 max-w-2xl text-sm leading-6 text-slate-500">
                By clicking “Submit Deletion Request”, you initiate a 48-hour
                cooling-off period during which you can still cancel the request
                by logging in. After this period, your data will be queued for
                permanent erasure.
              </p>
            </section>
          </form>
        </section>
      </main>
    </div>
  );
};

const ConsequenceCard = ({ icon, title, text }) => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-800">
        {icon}
      </div>

      <h3 className="mt-8 text-xl font-black">{title}</h3>
      <p className="mt-4 leading-7 text-slate-600">{text}</p>
    </div>
  );
};

export default VendorAccountDeletion;