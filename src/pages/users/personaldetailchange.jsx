import { apiFetch } from "../../services/api.js";
import { useState } from "react";
import {
  Search,
  ShieldCheck,
  Clock,
  FileText,
  HelpCircle,
  UploadCloud,
  Send,
  RotateCcw,
  BadgeCheck,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const PersonalDetailChange = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    detailType: "Business Address",
    currentInformation: "1220 Innovation Way, Suite 400, San Francisco, CA 94105",
    proposedInformation: "",
    reason: "",
    supportingDocument: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "supportingDocument") {
      setFormData((prev) => ({
        ...prev,
        supportingDocument: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const requestData = new FormData();

      requestData.append("detailType", formData.detailType);
      requestData.append("currentInformation", formData.currentInformation);
      requestData.append("proposedInformation", formData.proposedInformation);
      requestData.append("reason", formData.reason);

      if (formData.supportingDocument) {
        requestData.append("supportingDocument", formData.supportingDocument);
      }

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/users/change-requests`,
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

      setFormData({
        detailType: "Business Address",
        currentInformation:
          "1220 Innovation Way, Suite 400, San Francisco, CA 94105",
        proposedInformation: "",
        reason: "",
        supportingDocument: null,
      });
    } catch (error) {
      alert(error.message || "Unable to submit request.");
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

          <div className="hidden w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search events, vendors, or messages..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </header>

        <section className="grid min-w-0 gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400 sm:text-sm">
              Profile <span className="mx-2">›</span>
              <span className="text-teal-800">Request Change</span>
            </p>

            <h1 className="mt-4 break-words text-3xl font-black sm:text-4xl">
              Request Detail Change
            </h1>

            <div className="mt-8 rounded-2xl bg-teal-800 p-5 text-white sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <ShieldCheck size={26} />
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-xl font-black sm:text-2xl">
                    Security & Compliance Notice
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-teal-50/80 sm:text-base">
                    To ensure the integrity of the EventSure marketplace, direct
                    profile editing is restricted. All requested changes undergo
                    manual verification by our security team.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 min-w-0 rounded-3xl bg-white p-5 shadow-sm sm:p-8 lg:p-10"
            >
              <div className="min-w-0">
                <label className="label">Detail To Change</label>
                <select
                  name="detailType"
                  value={formData.detailType}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-xl bg-slate-100 px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700 sm:px-5 sm:text-base"
                >
                  <option>Business Address</option>
                  <option>Full Name</option>
                  <option>Email Address</option>
                  <option>Phone Number</option>
                  <option>Location</option>
                  <option>Account Type</option>
                </select>
              </div>

              <div className="mt-8 grid min-w-0 gap-6 md:grid-cols-2">
                <FormTextarea
                  label="Current Information"
                  name="currentInformation"
                  value={formData.currentInformation}
                  onChange={handleChange}
                  rows="4"
                />

                <FormTextarea
                  label="Proposed Information"
                  name="proposedInformation"
                  value={formData.proposedInformation}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter new detail..."
                />
              </div>

              <div className="mt-8">
                <FormTextarea
                  label="Reason For Change"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Briefly explain why this information needs to be updated..."
                />
              </div>

              <div className="mt-8">
                <label className="label">Supporting Documentation</label>

                <label className="mt-3 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center hover:border-teal-400 sm:min-h-52 sm:px-5">
                  <UploadCloud size={36} className="text-slate-300" />

                  <p className="mt-5 break-words font-black">
                    Click to upload or drag and drop
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    PDF, JPG or PNG max. 10MB
                  </p>

                  {formData.supportingDocument && (
                    <p className="mt-4 max-w-full break-words text-sm font-bold text-teal-800">
                      {formData.supportingDocument.name}
                    </p>
                  )}

                  <input
                    type="file"
                    name="supportingDocument"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-teal-800 px-6 py-4 text-sm font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70 sm:mt-10 sm:w-fit sm:px-10 sm:text-base"
              >
                {loading ? "Submitting..." : "Submit Request"}
                <Send size={17} />
              </button>
            </form>
          </div>

          <aside className="min-w-0 space-y-6 xl:space-y-8">
            <section className="min-w-0 rounded-3xl bg-slate-100 p-5 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <BadgeCheck className="mt-1 shrink-0 text-teal-800" />
                <h2 className="break-words text-xl font-black sm:text-2xl">
                  Verification Guidelines
                </h2>
              </div>

              <GuideItem
                icon={<Clock />}
                title="Review Window"
                text="Most requests are manually reviewed and verified within 24–48 business hours."
              />

              <GuideItem
                icon={<FileText />}
                title="Accepted Documents"
                text="Government issued ID, utility bill, registration document, or redacted bank statement."
              />

              <GuideItem
                icon={<HelpCircle />}
                title="Need Assistance?"
                text="For urgent compliance needs, contact compliance@eventsure.com."
              />

              <div className="mt-8 rounded-2xl bg-white p-5 sm:p-6">
                <p className="label">Request Status</p>
                <p className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-500">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                  <span className="min-w-0 break-words">No active requests</span>
                  <RotateCcw size={15} className="ml-auto shrink-0 text-slate-300" />
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-sm">
              <div className="h-32 bg-gradient-to-br from-teal-500 to-slate-900 sm:h-44" />
              <div className="p-5 sm:p-6">
                <h3 className="break-words font-black uppercase tracking-widest">
                  Elite Verification
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Tier 3 Premium Account Status Enabled
                </p>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

const FormTextarea = ({ label, ...props }) => {
  return (
    <div className="min-w-0">
      <label className="label">{label}</label>
      <textarea
        {...props}
        className="mt-3 w-full resize-none rounded-xl border-0 bg-slate-100 px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700 sm:px-5 sm:text-base"
      />
    </div>
  );
};

const GuideItem = ({ icon, title, text }) => {
  return (
    <div className="mt-7 flex gap-4 sm:mt-8 sm:gap-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-800 sm:h-12 sm:w-12">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="break-words font-black">{title}</h3>
        <p className="mt-2 break-words text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
};

export default PersonalDetailChange;