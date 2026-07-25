import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Mail,
  BadgeCheck,
  Clock,
  IdCard,
  Building2,
  UserCircle,
  Image,
  Check,
  Lock,
  Hourglass,
  RotateCcw,
  Headphones,
  CheckCircle,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const KYCStatus = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/kyc/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load KYC status");
        }

        const submission = data.latestSubmission;
        setKycData({
          applicationId: submission?._id || "Not submitted",
          estimatedCompletion: submission?.status === "pending" ? "Pending admin review" : submission?.reviewedAt || "Not available",
          completionPercent: submission ? (submission.status === "approved" ? 100 : submission.status === "pending" ? 75 : 100) : 0,
          vendor: { businessName: data.vendor?.businessName || "Your business", avatar: data.vendor?.logo || "/image1.png" },
          roadmap: [{ label: "Submission", done: Boolean(submission) }, { label: "Admin Review", active: submission?.status === "pending", icon: <Hourglass size={18} /> }, { label: "Final Decision", done: ["approved", "rejected"].includes(submission?.status), locked: !submission }],
          documents: [], timeline: submission ? [{ title: `KYC ${submission.status}`, date: submission.updatedAt || submission.createdAt, active: submission.status === "pending", done: submission.status !== "pending", note: submission.rejectionReason || "" }] : [],
          nextSteps: submission?.status === "rejected" ? [submission.rejectionReason] : [],
        });
      } catch (error) {
        setKycData(emptyKycData);
      } finally {
        setLoading(false);
      }
    };

    fetchKycStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading KYC status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search resources or help..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5 text-slate-700">
            <Bell size={21} />
            <Mail size={21} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black">
                  {kycData.vendor.businessName}
                </h4>
                <p className="text-xs text-slate-500">Premium Vendor</p>
              </div>
              <img
                src={kycData.vendor.avatar}
                alt={kycData.vendor.businessName}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                  <BadgeCheck size={42} />
                </div>

                <div>
                  <h1 className="text-xl font-black">KYC Status</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-teal-800 px-4 py-2 text-sm font-black text-white">
                      Level 2: Under Verification
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                      Application ID: #{kycData.applicationId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-sm text-slate-500">Est. Completion</p>
                <p className="mt-2 text-xl font-black text-teal-800">
                  {kycData.estimatedCompletion}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Verification Roadmap</h2>
              <p className="font-black text-teal-800">
                {kycData.completionPercent}% Complete
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-5">
              {kycData.roadmap.map((item) => (
                <RoadmapItem key={item.label} item={item} />
              ))}
            </div>
          </section>

          <div className="mt-12 grid gap-8 xl:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black">Submitted Documents</h2>
                  <button className="font-black text-teal-800">
                    View All Documents
                  </button>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {kycData.documents.map((document) => (
                    <DocumentCard key={document.title} document={document} />
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-slate-100 p-6 sm:p-8">
                <h2 className="text-xl font-black">Review Timeline</h2>

                <div className="mt-8 space-y-8">
                  {kycData.timeline.map((item) => (
                    <TimelineItem key={item.title} item={item} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <section className="rounded-3xl bg-teal-800 p-8 text-white shadow-xl">
                <Clock size={35} />

                <div className="mt-8 flex items-center justify-between">
                  <h2 className="text-3xl font-black">30-Day Probation</h2>
                  <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black">
                    Active Soon
                  </span>
                </div>

                <p className="mt-5 leading-7 text-teal-50/80">
                  Upon approval, new vendors undergo a 30-day quality assurance
                  period to ensure service excellence on EventSure.
                </p>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-teal-200">
                  Countdown-Minus Approval
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <CountdownBox value="30" label="Days" />
                  <CountdownBox value="00" label="Hrs" />
                  <CountdownBox value="00" label="Mins" />
                </div>
              </section>

              <section className="rounded-3xl bg-slate-100 p-8">
                <div className="-mt-14 mx-auto h-28 w-36 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300&auto=format&fit=crop"
                    alt="Next steps"
                    className="h-full w-full object-cover"
                  />
                </div>

                <h2 className="mt-8 text-center text-xl font-black">
                  Next Steps After Approval
                </h2>

                <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                  {kycData.nextSteps.map((step) => (
                    <li key={step} className="flex gap-3">
                      <CheckCircle
                        size={16}
                        className="mt-1 shrink-0 text-teal-800"
                      />
                      {step}
                    </li>
                  ))}
                </ul>

                <button className="mt-8 w-full rounded-xl bg-teal-800 px-5 py-4 font-black text-white">
                  Complete Profile Prep
                </button>
              </section>

              <section className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-800">
                    <Headphones size={24} />
                  </div>

                  <div>
                    <h3 className="font-black">Need help?</h3>
                    <p className="text-xs uppercase tracking-widest text-slate-400">
                      KYC Assistance Desk
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  Send our support team a request if you need help with
                  documentation issues.
                </p>

                <button className="mt-5 font-black text-teal-800">
                  Email Support →
                </button>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

const RoadmapItem = ({ item }) => {
  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border font-black ${
          item.done
            ? "border-teal-800 bg-teal-800 text-white"
            : item.active
            ? "border-teal-800 bg-teal-100 text-teal-800"
            : "border-slate-200 bg-slate-100 text-slate-400"
        }`}
      >
        {item.done ? <Check size={20} /> : item.locked ? <Lock size={18} /> : item.icon}
      </div>

      <p
        className={`mt-4 text-xs font-black uppercase tracking-[0.2em] ${
          item.done || item.active ? "text-teal-900" : "text-slate-400"
        }`}
      >
        {item.label}
      </p>
    </div>
  );
};

const DocumentCard = ({ document }) => {
  const Icon = document.icon;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-teal-800">
          <Icon size={24} />
        </div>

        <StatusBadge status={document.status} />
      </div>

      <h3 className="mt-8 text-lg font-black">{document.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {document.description}
      </p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Verified: "bg-teal-100 text-teal-800",
    Accepted: "bg-teal-100 text-teal-800",
    "Pending Review": "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
        styles[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
};

const TimelineItem = ({ item }) => {
  return (
    <div className="flex gap-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-white">
        {item.done ? <Check size={16} /> : <RotateCcw size={15} />}
      </div>

      <div>
        <h3 className="font-black">{item.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{item.date}</p>

        {item.note && (
          <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600">
            "{item.note}"
          </div>
        )}

        {item.active && (
          <div className="mt-4 flex gap-2">
            <span className="h-1 w-20 rounded-full bg-teal-800" />
            <span className="h-1 w-20 rounded-full bg-teal-100" />
            <span className="h-1 w-20 rounded-full bg-teal-100" />
          </div>
        )}
      </div>
    </div>
  );
};

const CountdownBox = ({ value, label }) => (
  <div className="rounded-xl bg-white/15 p-4 text-center">
    <p className="text-2xl font-black">{value}</p>
    <p className="mt-1 text-xs uppercase text-teal-100">{label}</p>
  </div>
);

const emptyKycData = {
  applicationId: "Not submitted",
  estimatedCompletion: "Not available",
  completionPercent: 0,
  vendor: { businessName: "Your business", avatar: "/image1.png" },
  roadmap: [],
  documents: [],
  timeline: [],
  nextSteps: [],
};

export default KYCStatus;
