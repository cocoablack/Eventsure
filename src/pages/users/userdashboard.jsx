import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  HelpCircle,
  Search,
  CalendarDays,
  ClipboardList,
  CheckCircle,
  WalletCards,
  MessageSquare,
  CreditCard,
  Plus,
  Star,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";
import {Link} from "react-router-dom";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/users/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboardData(data);
      } catch (error) {
        setDashboardData(emptyDashboardData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const data = dashboardData || emptyDashboardData;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-5 backdrop-blur lg:px-10">
<button
  type="button"
  onClick={() => setSidebarOpen(true)}
  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
>
  <Menu size={24} />
</button>

          <div className="hidden w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search events, vendors, or invoices..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Bell size={22} className="text-slate-700" />
            <Mail size={22} className="text-slate-700" />
            <HelpCircle size={22} className="text-slate-700" />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-bold">{data.user.name}</h4>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  {data.user.membership}
                </p>
              </div>

              <img
                src={data.user.avatar}
                alt={data.user.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="w-full max-w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {data.user.firstName}!
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Your luxury gala planning is {data.progress}% complete. You have{" "}
              {data.pendingOffers} new vendor offers waiting for your review
              today.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<CalendarDays />}
              label="Active Bookings"
              value={data.stats.activeBookings}
              badge="+2 this week"
            />
            <StatCard
              icon={<ClipboardList />}
              label="Pending Offers"
              value={data.stats.pendingOffers}
              iconColor="text-orange-600"
              bgColor="bg-orange-50"
            />
            <StatCard
              icon={<CheckCircle />}
              label="Completed Events"
              value={data.stats.completedEvents}
            />
            <StatCard
              icon={<WalletCards />}
              label="Total Spent"
              value={data.stats.totalSpent}
              bgColor="bg-teal-50"
            />
          </div>

          <div className="mt-10 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-8">
              {/* Recent Bookings */}
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold">Recent Booking Requests</h2>
                  <button className="text-sm font-bold text-teal-800">
                    View All
                  </button>
                </div>
<div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-widest text-slate-400">
                        <th className="pb-5">Vendor</th>
                        <th className="pb-5">Event Type</th>
                        <th className="pb-5">Date</th>
                        <th className="pb-5">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {data.recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                                {booking.initials}
                              </span>
                              <span className="font-semibold">
                                {booking.vendor}
                              </span>
                            </div>
                          </td>

                          <td className="py-5 text-slate-600">
                            {booking.eventType}
                          </td>

                          <td className="py-5 text-slate-600">
                            {booking.date}
                          </td>

                          <td className="py-5">
                            <StatusBadge status={booking.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Current Negotiations */}
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold">Current Negotiations</h2>

                <div className="mt-7 space-y-4">
                  {data.negotiations.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between ${
                        item.active ? "border-l-4 border-teal-700" : ""
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-800">
                          {item.type === "chat" ? (
                            <MessageSquare />
                          ) : (
                            <CreditCard />
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <button
  className={`w-full rounded-xl px-5 py-3 text-sm font-bold sm:w-auto ${
                          item.active
                            ? "bg-teal-800 text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <aside className="min-w-0 space-y-8">
              <div className="rounded-2xl bg-slate-950 p-8 text-white shadow-xl">
                <h2 className="text-2xl font-bold">Upcoming Dates</h2>

                <div className="mt-7 space-y-6">
                  {data.upcomingDates.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white/10 text-center">
                        <span className="text-xs uppercase text-slate-300">
                          {item.month}
                        </span>
                        <span className="text-xl font-bold">{item.day}</span>
                      </div>

                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-8 w-full rounded-xl bg-white/10 px-4 py-4 text-sm font-bold hover:bg-white/20">
                  Open Calendar
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Spotlight Vendors</h2>

                <div className="mt-6 space-y-5">
                  {data.spotlightVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      <div className="relative h-36 bg-gradient-to-br from-teal-100 to-slate-300">
                        <button className="absolute bottom-4 right-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-white shadow-lg">
                          <Plus size={30} />
                        </button>
                      </div>

                      <div className="min-w-0 p-5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-800">
                            {vendor.category}
                          </span>

                          <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                            <Star
                              size={15}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            {vendor.rating}
                          </span>
                        </div>

                        <h3 className="mt-4 break-words text-lg font-bold">
                          {vendor.name}
                        </h3>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                          {vendor.description}
                        </p>

                        <button className="mt-5 w-full rounded-xl bg-teal-800 px-4 py-3 text-sm font-bold text-white hover:bg-teal-900">
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
             <footer className="bg-slate-50 px-6 py-12">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-black text-teal-800">EventSure</h3>
        <p className="mt-3 max-w-md text-sm text-slate-500">
          Premium marketplace for secure event vendor discovery and booking.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:gap-6">
        <Link to="/terms-and-conditions">Terms and Conditions</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/contact">Contact Support</Link>
      </div>
    </div>

    <p className="mt-10 text-center text-xs text-slate-400">
      © 2026 EventSure. Secure vendor marketplace.
    </p>
  </footer>
      </main>
 
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  badge,
  iconColor = "text-teal-800",
  bgColor = "bg-slate-100",
}) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${bgColor} ${iconColor}`}
        >
          {icon}
        </div>

        {badge && (
          <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-black">{value}</h3>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Confirmed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-orange-50 text-orange-700",
    "In Review": "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

const emptyDashboardData = {
  user: { name: "EventSure user", firstName: "there", membership: "Event Planner", avatar: "/image1.png" },
  progress: 0,
  pendingOffers: 0,
  stats: { activeBookings: 0, pendingOffers: 0, completedEvents: 0, totalSpent: 0 },
  recentBookings: [],
  negotiations: [],
  upcomingDates: [],
  spotlightVendors: [],
};

export default UserDashboard;
