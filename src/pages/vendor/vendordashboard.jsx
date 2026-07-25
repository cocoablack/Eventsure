import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Mail,
  HelpCircle,
  WalletCards,
  CalendarCheck,
  Inbox,
  BadgeCheck,
  Shield,
  Star,
  Sun,
  Eye,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load vendor dashboard");
        }

        setDashboardData(data);
      } catch (error) {
        setDashboardData(emptyDashboardData);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading vendor dashboard...</p>
      </div>
    );
  }

  const data = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search events, clients, or analytics..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5 text-slate-700">
            <Bell size={21} />
            <Mail size={21} />
            <HelpCircle size={21} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black">{data.vendor.name}</h4>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Premium Vendor
                </p>
              </div>

              <img
                src={data.vendor.avatar}
                alt={data.vendor.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Welcome back, {data.vendor.businessName}.
              </h1>
              <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-600">
                You have{" "}
                <span className="font-black text-teal-800">
                  {data.stats.newBookingRequests} new booking requests
                </span>{" "}
                and{" "}
                <span className="font-black text-teal-800">
                  {data.stats.activeJobs} active projects
                </span>{" "}
                for this month. Your gallery spotlight is currently trending in
                the {data.vendor.trendingCategory} category.
              </p>
            </div>

            <div className="flex -space-x-3">
              {data.teamPreview.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="h-11 w-11 rounded-full border-2 border-white object-cover"
                />
              ))}
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm font-black">
                +6
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <StatCard
              icon={<WalletCards />}
              label="Total Earnings"
              value={formatMoney(data.stats.totalEarnings)}
              badge="+12% vs last month"
            />

            <StatCard
              icon={<CalendarCheck />}
              label="Active Jobs"
              value={data.stats.activeJobs}
            />

            <div className="relative overflow-hidden rounded-3xl bg-teal-800 p-8 text-white shadow-xl shadow-teal-900/20">
              <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                Urgent
              </span>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Inbox size={28} />
              </div>

              <p className="mt-10 text-sm text-teal-100">New Requests</p>
              <h3 className="mt-2 text-4xl font-black">
                {data.stats.newBookingRequests}
              </h3>

              <Inbox
                size={130}
                className="absolute -bottom-5 -right-5 text-white/10"
              />
            </div>
          </div>

          <div className="mt-12">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              Business Health & Standing
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <HealthCard
                icon={<BadgeCheck />}
                label="KYC Status"
                value={data.health.kycStatus}
                color="green"
              />
              <HealthCard
                icon={<Shield />}
                label="Probation"
                value={data.health.probation}
                color="green"
              />
              <HealthCard
                icon={<Star />}
                label="Subscription"
                value={data.health.subscription}
                color="teal"
                active
              />
              <HealthCard
                icon={<Sun />}
                label="Spotlight"
                value={data.health.spotlight}
                subText="til Nov 12"
                color="orange"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-8 xl:grid-cols-[1fr_340px]">
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Recent Booking Requests</h2>
                <button className="font-black text-teal-800">
                  View all requests
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="hidden grid-cols-[1.5fr_120px_140px_170px] bg-white px-8 py-6 text-xs font-black uppercase tracking-[0.25em] text-slate-400 lg:grid">
                  <span>Event Type</span>
                  <span>Date</span>
                  <span>Budget</span>
                  <span>Actions</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {data.recentRequests.map((request) => (
                    <RequestRow key={request.id} request={request} />
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section>
                <h2 className="text-2xl font-black">Active Progress</h2>

                <div className="mt-6 rounded-3xl bg-slate-100 p-8">
                  <div className="space-y-7">
                    {data.activeProgress.map((project) => (
                      <ProgressItem key={project.id} project={project} />
                    ))}
                  </div>

                  <button className="mt-8 w-full rounded-xl border border-teal-300 bg-white px-5 py-4 font-black text-teal-800">
                    Manage All Active Jobs
                  </button>
                </div>
              </section>

              <section className="relative rounded-3xl bg-white p-8 shadow-xl">
                <img
                  src={data.spotlightPerformance.image}
                  alt={data.spotlightPerformance.title}
                  className="absolute -left-6 -top-8 h-24 w-24 rounded-xl object-cover shadow-xl"
                />

                <div className="ml-20">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                    Spotlight Performance
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    {data.spotlightPerformance.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {data.spotlightPerformance.description}
                  </p>

                  <button className="mt-5 font-black text-teal-800">
                    Optimize gallery →
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, badge }) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
          {icon}
        </div>

        {badge && (
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-10 text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 text-4xl font-black">{value}</h3>
    </div>
  );
};

const HealthCard = ({ icon, label, value, subText, color, active }) => {
  const styles = {
    green: "bg-green-50 text-green-700",
    teal: "bg-teal-50 text-teal-800",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-sm ${
        active ? "border border-teal-200" : ""
      }`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${styles[color]}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="font-black">
            {value}{" "}
            {subText && (
              <span className="text-xs font-medium text-slate-400">
                {subText}
              </span>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
};

const RequestRow = ({ request }) => {
  return (
    <div className="grid gap-5 p-6 lg:grid-cols-[1.5fr_120px_140px_170px] lg:items-center lg:px-8">
      <div className="flex items-center gap-5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${request.bg}`}
        >
          {request.icon}
        </div>

        <div>
          <h3 className="font-black">{request.eventType}</h3>
          <p className="text-sm text-slate-400">Client: {request.client}</p>
        </div>
      </div>

      <p className="font-bold">{request.date}</p>

      <p className="font-black text-teal-800">{formatMoney(request.budget)}</p>

      <div className="flex items-center gap-4">
        <button className="rounded-xl bg-teal-800 px-5 py-3 text-sm font-black text-white shadow-lg">
          Respond
        </button>
        <Eye size={22} className="text-slate-400" />
      </div>
    </div>
  );
};

const ProgressItem = ({ project }) => {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-black">{project.title}</h3>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Milestone {project.milestone}
          </p>
        </div>

        <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-black text-teal-800">
          {project.percent}%
        </span>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white">
        <div
          className="h-2 rounded-full bg-teal-800"
          style={{ width: `${project.percent}%` }}
        />
      </div>
    </div>
  );
};

const formatMoney = (amount) => {
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
};

const emptyDashboardData = {
  vendor: { name: "Vendor", businessName: "Your business", trendingCategory: "", avatar: "/image1.png" },
  stats: { totalEarnings: 0, activeJobs: 0, newBookingRequests: 0 },
  health: { kycStatus: "Not submitted", probation: "None", subscription: "Free", spotlight: "Inactive" },
  teamPreview: [],
  recentRequests: [],
  activeProgress: [],
  spotlightPerformance: { title: "No active spotlight", description: "Spotlight billing is not enabled yet.", image: "/image1.png" },
};

export default VendorDashboard;
