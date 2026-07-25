import { apiFetch } from "../../services/api.js";
import { useState } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  Shield,
  UploadCloud,
  Lock,
  Eye,
  FileText,
  MapPin,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const VendorPersonalDetailChange = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    detailType: "Business Name",
    currentValue: "Artisan Florals Limited",
    newValue: "",
    reason: "",
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const requestData = new FormData();

      requestData.append("detailType", formData.detailType);
      requestData.append("currentValue", formData.currentValue);
      requestData.append("newValue", formData.newValue);
      requestData.append("reason", formData.reason);

      if (formData.document) {
        requestData.append("document", formData.document);
      }

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/change-requests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: requestData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      alert("Change request submitted successfully.");
    } catch (error) {
      alert(error.message || "Unable to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex w-full max-w-sm items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search operations..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5 text-slate-700">
            <Bell size={21} />
            <MessageSquare size={21} />
            <HelpCircle size={21} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black">Artisan Florals Ltd.</h4>
                <p className="text-xs text-slate-500">Premium Vendor</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
                alt="Vendor"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            Profile <span className="mx-2">›</span>{" "}
            <span className="text-teal-800">Change Request</span>
          </p>

          <h1 className="mt-4 text-4xl font-black">Account Integrity</h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
            Modify your core business information. To maintain marketplace
            trust, all verified data updates undergo a rigorous compliance
            review process.
          </p>

          <section className="mt-10 rounded-2xl border-l-4 border-teal-800 bg-teal-50 p-6">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white">
                <Shield size={22} />
              </div>

              <div>
                <h2 className="font-black text-teal-900">
                  Compliance Advisory Notice
                </h2>
                <p className="mt-2 leading-7 text-slate-700">
                  Any changes to your legal business name, registered address,
                  or tax IDs will temporarily suspend your verified badge until
                  our compliance team validates the supporting documents. This
                  process typically takes 24-48 business hours.
                </p>
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-10"
          >
            <div className="grid gap-10 xl:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <label className="label">Detail To Change</label>
                  <select
                    name="detailType"
                    value={formData.detailType}
                    onChange={handleChange}
                    className="mt-3 w-full border border-slate-300 bg-slate-100 px-5 py-4 outline-none focus:border-teal-800"
                  >
                    <option>Business Name</option>
                    <option>Registered Email</option>
                    <option>Phone Number</option>
                    <option>Primary Business Address</option>
                    <option>Tax ID</option>
                    <option>CAC Registration Detail</option>
                  </select>
                </div>

                <div>
                  <label className="label">Current Value Verified</label>
                  <input
                    name="currentValue"
                    value={formData.currentValue}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-xl bg-slate-100 px-5 py-4 italic outline-none focus:ring-2 focus:ring-teal-800"
                  />
                </div>

                <div>
                  <label className="label">Requested New Value</label>
                  <input
                    name="newValue"
                    value={formData.newValue}
                    onChange={handleChange}
                    required
                    placeholder="Enter updated information"
                    className="mt-3 w-full bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-teal-800"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="label">Reason For Change</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Briefly explain the nature of this update e.g. Legal re-branding, office relocation"
                    className="mt-3 w-full resize-none bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-teal-800"
                  />
                </div>

                <div>
                  <label className="label">Supporting Documentation</label>

                  <label className="mt-3 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center hover:border-teal-400">
                    <UploadCloud size={34} className="text-teal-800" />

                    <p className="mt-5 font-black">
                      Drag & Drop or{" "}
                      <span className="text-teal-800 underline">Browse</span>
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      PDF, JPG, or PNG max 5MB
                    </p>

                    <p className="mt-2 text-xs italic text-slate-400">
                      Required: Business license or official letterhead
                    </p>

                    {formData.document && (
                      <p className="mt-4 text-sm font-black text-teal-800">
                        {formData.document.name}
                      </p>
                    )}

                    <input
                      type="file"
                      name="document"
                      accept=".pdf,image/png,image/jpeg"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-5 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex max-w-md items-center gap-3 text-xs font-medium text-slate-500">
                <Lock size={15} />
                Submitted information is restricted to authenticated review
                workflows. Do not include unnecessary sensitive information.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded-xl px-8 py-4 font-black text-slate-700"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  className="rounded-xl bg-teal-800 px-10 py-4 font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </form>

          <section className="mt-20">
            <h2 className="text-2xl font-black">Request History</h2>

            <div className="mt-8 space-y-5">
              <HistoryRow
                icon={<FileText />}
                title="Update Contact Number"
                date="Submitted Oct 12, 2023"
                status="Approved"
              />

              <HistoryRow
                icon={<MapPin />}
                title="Address Relocation"
                date="Submitted May 04, 2023"
                status="Archived"
                muted
              />
            </div>
          </section>

          <footer className="mt-24 flex flex-col gap-4 border-t border-slate-100 py-8 text-xs font-black uppercase tracking-[0.25em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2024 EventSure Compliance Module</p>
            <div className="flex gap-8">
              <span>Data Protection Policy</span>
              <span>Vendor Terms</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

const HistoryRow = ({ icon, title, date, status, muted }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl p-6 shadow-sm ${
        muted ? "bg-slate-100 opacity-60" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-500">
          {icon}
        </div>

        <div>
          <h3 className="font-black">{title}</h3>
          <p className="text-sm text-slate-400">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span
          className={`rounded-full px-4 py-2 text-xs font-black uppercase ${
            status === "Approved"
              ? "bg-teal-100 text-teal-800"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {status}
        </span>

        <Eye size={20} className="text-slate-500" />
      </div>
    </div>
  );
};

export default VendorPersonalDetailChange;
