import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  Download,
  WalletCards,
  Star,
  Users,
  CheckCircle,
  CalendarDays,
  Filter,
  ReceiptText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const CompletedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/jobs/completed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load completed jobs");
        }

        const nextJobs = (data.jobs || []).map((job) => ({ _id: job._id, title: job.title, shortDescription: job.eventType,
          category: job.eventType, eventDate: job.eventDate, finalCost: job.totalAmount || 0, payoutStatus: job.paymentStatus,
          rating: 0, review: "No review submitted.", client: { name: job.user?.fullName || "Client", avatar: job.user?.avatar || "/image1.png" } }));
        setJobs(nextJobs);
        setSummary({ vendor: { businessName: data.vendor?.businessName || "Your business", avatar: data.vendor?.logo || "/image1.png" }, totalCompleted: nextJobs.length, totalRevenue: nextJobs.reduce((sum, item) => sum + item.finalCost, 0), averageRating: null, repeatClients: 0, payoutsReleased: 0 });
      } catch (error) {
        setJobs([]);
        setSummary(emptySummary);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading completed jobs...</p>
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
              placeholder="Search invoices or events..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5 text-slate-700">
            <Bell size={22} />
            <MessageSquare size={22} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black">
                  {summary.vendor.businessName}
                </h4>
                <p className="text-xs text-slate-500">Premium Vendor</p>
              </div>

              <img
                src={summary.vendor.avatar}
                alt={summary.vendor.businessName}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black">Completed Jobs</h1>
              <p className="mt-4 flex items-center gap-2 text-lg text-slate-600">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                Showing {summary.totalCompleted} completed engagements from your
                history
              </p>
            </div>

            <button className="flex w-fit items-center gap-3 rounded-xl bg-teal-800 px-7 py-4 font-black text-white shadow-xl shadow-teal-900/20">
              <Download size={18} />
              Export Report
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={<WalletCards />}
              label="Total Revenue"
              value={formatMoney(summary.totalRevenue)}
              badge="+12% vs last month"
              tone="teal"
            />
            <SummaryCard
              icon={<Star />}
              label="Avg. Rating"
              value={`${summary.averageRating}`}
              subValue="/5.0"
              tone="orange"
            />
            <SummaryCard
              icon={<Users />}
              label="Repeat Clients"
              value={`${summary.repeatClients}%`}
              tone="blue"
            />
            <SummaryCard
              icon={<CheckCircle />}
              label="Payouts Released"
              value={summary.payoutsReleased}
              subValue={`/${summary.totalCompleted}`}
              tone="green"
            />
          </div>

          <div className="mt-10 rounded-2xl bg-slate-100 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <FilterButton icon={<CalendarDays size={17} />} label="All Time" />
              <FilterButton icon={<Filter size={17} />} label="Event Type" />
              <FilterButton icon={<Star size={17} />} label="Rating: 4.5+" />

              <button className="ml-auto rounded-xl bg-white px-7 py-4 font-black text-teal-800">
                Reset Filters
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Page 1 of 5</p>

            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-white p-3 text-slate-400">
                <ChevronLeft size={18} />
              </button>
              <button className="rounded-lg bg-teal-800 px-4 py-3 font-black text-white">
                1
              </button>
              <button className="rounded-lg bg-white px-4 py-3 font-bold">
                2
              </button>
              <button className="rounded-lg bg-white px-4 py-3 font-bold">
                3
              </button>
              <button className="rounded-lg bg-white p-3">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, subValue, badge, tone }) => {
  const styles = {
    teal: "bg-teal-50 text-teal-800",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-teal-50 text-teal-800",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${styles[tone]}`}
        >
          {icon}
        </div>

        {badge && (
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-black">
        {value}
        {subValue && (
          <span className="ml-1 text-xl font-medium text-slate-300">
            {subValue}
          </span>
        )}
      </h3>
    </div>
  );
};

const FilterButton = ({ icon, label }) => {
  return (
    <button className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-medium text-slate-700">
      {icon}
      {label}
    </button>
  );
};

const JobCard = ({ job }) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr_150px_1.2fr_100px] xl:items-center">
        <div className="grid gap-5 sm:grid-cols-[70px_1fr]">
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-600">
              {job.category}
            </span>
            <p className="mt-5 text-xs leading-5 text-slate-400">
              {job.eventDate}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black leading-tight">{job.title}</h2>
            <p className="mt-1 text-slate-500">{job.shortDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={job.client.avatar}
            alt={job.client.name}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <h3 className="font-black">{job.client.name}</h3>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Client
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black">{formatMoney(job.finalCost)}</h3>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-black ${
              job.payoutStatus === "Released"
                ? "bg-teal-100 text-teal-800"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {job.payoutStatus}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1 text-teal-800">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={15}
                className={star <= Math.round(job.rating) ? "fill-teal-800" : ""}
              />
            ))}
            <span className="ml-2 font-black text-slate-900">{job.rating}</span>
          </div>

          <p className="mt-2 text-sm italic leading-6 text-slate-600">
            "{job.review}"
          </p>
        </div>

        <div className="flex items-center gap-5 xl:justify-end">
          <button className="text-slate-700">
            <ReceiptText size={24} />
          </button>
          <button className="text-slate-700">
            <ExternalLink size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

const formatMoney = (amount) => {
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
};

const emptySummary = {
  vendor: {
    businessName: "Your business",
    avatar: "/image1.png",
  },
  totalCompleted: 0,
  totalRevenue: 0,
  averageRating: null,
  repeatClients: 0,
  payoutsReleased: 0,
};

export default CompletedJobs;
