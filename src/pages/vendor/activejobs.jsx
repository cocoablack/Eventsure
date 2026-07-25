import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  CalendarCheck,
  Flag,
  WalletCards,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "Status",
    dateRange: "Date Range",
    paymentStage: "Payment Stage",
  });

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams(filters).toString();

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/jobs/active?${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load active jobs");
        }

        const nextJobs = (data.jobs || []).map((job) => ({
          _id: job._id, title: job.title, service: (job.services || []).map((item) => item.title).join(", ") || job.eventType,
          image: job.vendor?.coverImage || "/image1.png", client: { name: job.user?.fullName || "Client", avatar: job.user?.avatar || "/image1.png" },
          eventDate: job.eventDate, daysLeft: Math.max(0, Math.ceil((new Date(job.eventDate) - new Date()) / 86400000)),
          paymentBadges: [job.paymentStatus], progress: job.status === "active" ? 60 : 25, status: job.status,
        }));
        setJobs(nextJobs);
        setSummary({ vendor: { name: data.vendor?.businessName || "Your business", avatar: data.vendor?.logo || "/image1.png" }, totalActiveJobs: nextJobs.length, upcomingMilestones: nextJobs.length, pendingPayments: 0, completionRequests: 0 });
      } catch (error) {
        setJobs([]);
        setSummary(emptySummary);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, [filters]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading active jobs...</p>
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
              placeholder="Search active contracts..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Bell size={22} className="text-slate-700" />
            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <span className="font-black">Profile</span>
              <img
                src={summary.vendor.avatar}
                alt={summary.vendor.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <div>
            <h1 className="text-3xl font-black">Active Jobs</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Manage your ongoing event contracts, track milestone progress, and
              handle payment stages for all current client engagements.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={<CalendarCheck />}
              value={summary.totalActiveJobs}
              label="Total Active Jobs"
              tone="teal"
            />
            <SummaryCard
              icon={<Flag />}
              value={summary.upcomingMilestones}
              label="Upcoming Milestones"
              subText="8 Due"
              tone="red"
            />
            <SummaryCard
              icon={<WalletCards />}
              value={formatShortMoney(summary.pendingPayments)}
              label="Pending Payments"
              tone="blue"
            />
            <SummaryCard
              icon={<CheckCircle />}
              value={summary.completionRequests}
              label="Completion Requests"
              subText="Ready"
              tone="green"
            />
          </div>

          <section className="mt-10 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-300 pb-4">
              <Search size={20} className="text-slate-400" />
              <input
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search by job title or client name..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="mt-5 flex flex-col gap-4 md:flex-row">
              <FilterSelect
                name="status"
                value={filters.status}
                onChange={handleChange}
                options={["Status", "In Progress", "Planning", "Ready"]}
              />

              <FilterSelect
                name="dateRange"
                value={filters.dateRange}
                onChange={handleChange}
                options={["Date Range", "This Month", "Next 30 Days", "This Year"]}
              />

              <FilterSelect
                name="paymentStage"
                value={filters.paymentStage}
                onChange={handleChange}
                options={[
                  "Payment Stage",
                  "Deposit Paid",
                  "Milestone",
                  "Final Payment Pending",
                ]}
              />

              <button className="rounded-xl bg-teal-800 px-8 py-4 font-black text-white">
                Apply
              </button>
            </div>
          </section>

          <section className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="hidden grid-cols-[1.5fr_1fr_120px_1.2fr_1fr_1fr] bg-slate-100 px-8 py-6 text-sm font-black uppercase tracking-[0.25em] text-slate-800 lg:grid">
              <span>Event Title</span>
              <span>Client</span>
              <span>Event Date</span>
              <span>Payment Stage</span>
              <span>Progress</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <JobRow key={job._id} job={job} />
              ))}
            </div>

            <div className="flex flex-col gap-5 border-t border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing 1-3 of {summary.totalActiveJobs} active jobs
              </p>

              <div className="flex items-center gap-4">
                <ChevronLeft size={20} className="text-slate-400" />
                <button className="rounded-lg bg-teal-800 px-4 py-3 font-black text-white">
                  1
                </button>
                <button className="font-bold text-slate-700">2</button>
                <button className="font-bold text-slate-700">3</button>
                <ChevronRight size={20} />
              </div>
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-2xl bg-teal-800 text-white">
            <div className="grid gap-8 p-8 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <h2 className="text-2xl font-black">
                  Scale Your Business with Pro Features
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-teal-50/80">
                  Upgrade to our Enterprise tier to unlock advanced multi-vendor
                  collaboration, priority dispute resolution, and automated tax
                  reporting for all your event contracts.
                </p>

                <button className="mt-8 rounded-xl bg-white px-8 py-4 font-black text-teal-800">
                  Explore Enterprise
                </button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop"
                alt="Analytics"
                className="h-60 w-full rounded-xl object-cover"
              />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ icon, value, label, subText, tone }) => {
  const styles = {
    teal: "bg-teal-50 text-teal-800",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-teal-50 text-teal-800",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${styles[tone]}`}
        >
          {icon}
        </div>

        {subText && (
          <span className="font-black text-teal-800">{subText}</span>
        )}
      </div>

      <h3 className="mt-5 text-2xl font-black">{value}</h3>
      <p className="mt-1 text-sm font-medium uppercase tracking-widest text-slate-600">
        {label}
      </p>
    </div>
  );
};

const FilterSelect = ({ options, ...props }) => {
  return (
    <select
      {...props}
      className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-4 outline-none focus:border-teal-800"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
};

const JobRow = ({ job }) => {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr_120px_1.2fr_1fr_1fr] lg:items-center lg:px-8 lg:py-8">
      <div className="flex items-center gap-5">
        <img
          src={job.image}
          alt={job.title}
          className="h-14 w-14 rounded-xl object-cover"
        />

        <div>
          <h3 className="font-black">{job.title}</h3>
          <p className="text-slate-600">{job.service}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={job.client.avatar}
          alt={job.client.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <p className="font-medium">{job.client.name}</p>
      </div>

      <div>
        <p className="font-medium">{job.eventDate}</p>
        <p className="text-xs font-black uppercase text-red-600">
          In {job.daysLeft} days
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.paymentBadges.map((badge) => (
          <span
            key={badge}
            className={`rounded-md px-2 py-1 text-xs font-black uppercase ${
              badge.includes("Deposit") || badge.includes("Paid")
                ? "bg-teal-100 text-teal-800"
                : badge.includes("Final")
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {badge}
          </span>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-bold">{job.progress}%</p>
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-teal-800"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      <Status status={job.status} />
    </div>
  );
};

const Status = ({ status }) => {
  return (
    <span className="flex items-center gap-2 text-lg font-medium text-teal-800">
      <span
        className={`h-2 w-2 rounded-full ${
          status === "Ready" ? "bg-teal-800" : "bg-slate-500"
        }`}
      />
      {status}
    </span>
  );
};

const formatShortMoney = (amount) => {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", notation: "compact" }).format(amount || 0);
};

const emptySummary = {
  vendor: {
    name: "Your business",
    avatar: "/image1.png",
  },
  totalActiveJobs: 0,
  upcomingMilestones: 0,
  pendingPayments: 0,
  completionRequests: 0,
};

export default ActiveJobs;
