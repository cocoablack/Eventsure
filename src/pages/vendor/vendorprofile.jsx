import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  CheckCircle,
  Sparkles,
  Shield,
  FilePenLine,
  HelpCircle,
  Trash2,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/profile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load vendor profile");
        }

        setProfile(data.vendor);
      } catch (error) {
        setProfile(emptyProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading vendor profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Search profile settings, documents..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Bell size={22} className="text-slate-700" />
            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <h4 className="font-black">{profile.businessName}</h4>
              <img
                src={profile.avatar}
                alt={profile.businessName}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-800">
            Workspace Settings
          </p>
          <h1 className="mt-2 text-xl font-black">Vendor Profile</h1>

          <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
                <div className="grid gap-8 md:grid-cols-2">
                  <InfoBlock label="Business Name" value={profile.businessName} />
                  <InfoBlock label="Username" value={`@${profile.username}`} teal />
                  <InfoBlock label="Registered Email" value={profile.email} />
                  <InfoBlock label="Phone Number" value={profile.phone} />
                </div>

                <div className="mt-8 border-t border-slate-100 pt-8">
                  <InfoBlock
                    label="Primary Business Address"
                    value={profile.businessAddress}
                  />
                </div>
              </section>

              <section className="rounded-3xl border-l-4 border-teal-700 bg-slate-100 p-7">
                <div className="flex gap-5">
                  <Shield className="shrink-0 text-teal-800" size={25} />
                  <div>
                    <h2 className="text-xl font-black">
                      Security & Integrity Notice
                    </h2>
                    <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
                      To maintain marketplace integrity, core business details
                      verified during KYC cannot be edited directly. Any changes
                      to these fields require a formal review by our compliance
                      team.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black">Platform Status</h2>

              <div className="mt-8 space-y-8">
                <StatusRow
                  label="Verification"
                  value={profile.verificationStatus}
                  icon={<CheckCircle />}
                />

                <StatusRow
                  label="Subscription"
                  value={profile.subscriptionPlan}
                  note="Manage"
                />

                <StatusRow
                  label="Spotlight Status"
                  value={profile.spotlightStatus}
                  icon={<Sparkles />}
                  note="Details"
                />
              </div>

              <div className="mt-10 border-t border-slate-100 pt-8">
                <div className="rounded-xl bg-slate-100 p-5 text-center">
                  <p className="text-sm text-slate-500">Next Billing Cycle</p>
                  <h3 className="mt-2 font-black">{profile.nextBillingCycle}</h3>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black">Action Center</h2>
            <p className="italic text-slate-600">
              Requests typically processed within 48 hours
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <ActionCard
              featured
              icon={<FilePenLine />}
              title="Request Detail Change"
              text="Formal request to update legal business information, tax ID, or physical address."
              action="Start Request"
              path="/vendor/profile/change-request"
            />

            <ActionCard
              icon={<HelpCircle />}
              title="Contact Support"
              text="Speak with our marketplace success team regarding your account or profile."
              action="Open Ticket"
              path="/vendor/messages"
            />

            <ActionCard
              danger
              icon={<Trash2 />}
              title="Close Account"
              text="Initiate the permanent closure of your vendor portal and marketplace profile."
              action="Delete Request"
              path="/vendor/profile/delete-account"
            />
          </div>

          <footer className="mt-24 border-t border-slate-100 py-8 text-center text-sm text-slate-400">
            © 2024 EventSure Inc. Professional Vendor Identity Managed
            Environment.
          </footer>
        </section>
      </main>
    </div>
  );
};

const InfoBlock = ({ label, value, teal }) => (
  <div>
    <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
      {label}
    </p>
    <p
      className={`mt-3 text-lg font-medium leading-8 ${
        teal ? "font-black text-teal-800" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

const StatusRow = ({ label, value, icon, note }) => {
  return (
    <div>
      <p className="text-lg text-slate-400">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-lg font-black">
          {icon && <span className="text-teal-800">{icon}</span>}
          {value}
        </p>

        {note && <button className="font-black text-teal-800">{note}</button>}
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, text, action, path, featured, danger }) => {
  return (
    <Link
      to={path}
      className={`rounded-3xl p-8 shadow-sm ${
        featured
          ? "bg-teal-800 text-white"
          : "bg-white text-slate-950"
      }`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl ${
          danger
            ? "bg-red-50 text-red-600"
            : featured
            ? "bg-white/15 text-white"
            : "bg-teal-50 text-teal-800"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-8 text-2xl font-black">{title}</h3>
      <p
        className={`mt-4 min-h-24 leading-7 ${
          featured ? "text-teal-50/85" : "text-slate-600"
        }`}
      >
        {text}
      </p>

      <p
        className={`mt-7 flex items-center gap-2 font-black ${
          danger ? "text-red-600" : featured ? "text-white" : "text-teal-800"
        }`}
      >
        {action}
        {danger ? <AlertTriangle size={17} /> : <MessageSquare size={17} />}
      </p>
    </Link>
  );
};

const emptyProfile = {
  businessName: "Your business",
  username: "",
  email: "",
  phone: "",
  businessAddress: "",
  verificationStatus: "Not submitted",
  subscriptionPlan: "Free",
  spotlightStatus: "Inactive",
  nextBillingCycle: "Not applicable",
  avatar: "/image1.png",
};

export default VendorProfile;
