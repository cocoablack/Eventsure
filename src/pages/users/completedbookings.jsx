import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  CalendarCheck,
  WalletCards,
  BadgeCheck,
  Star,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const CompletedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/completed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load completed bookings");
        }

        setBookings(data.bookings);
        setSummary(data.summary);
      } catch (error) {
        setBookings([]);
        setSummary(emptySummary);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading completed bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
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
              placeholder="Search bookings..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Bell size={22} className="text-slate-700" />
            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-bold">{summary.user.name}</h4>
                <p className="text-xs text-slate-500">{summary.user.role}</p>
              </div>
              <img
                src={summary.user.avatar}
                alt={summary.user.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <span className="rounded-full bg-teal-100 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-teal-800">
            Dashboard
          </span>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Completed Bookings
              </h1>
              <p className="mt-3 max-w-3xl text-slate-500">
                Review and manage your successfully hosted events. Access
                receipts, view event performance metrics, and share your
                experiences with vendors.
              </p>
            </div>

            <div className="flex w-fit rounded-xl bg-slate-100 p-1">
              <Link
                to="/user/bookings"
                className="rounded-lg px-7 py-3 font-medium text-slate-500"
              >
                Active
              </Link>
              <button className="rounded-lg bg-white px-7 py-3 font-bold text-teal-800 shadow-sm">
                Completed
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <SummaryCard
              icon={<CalendarCheck />}
              label="Total Events Hosted"
              value={summary.totalEvents}
              subText="+12% vs last year"
            />
            <SummaryCard
              icon={<WalletCards />}
              label="Total Spent"
              value={formatMoney(summary.totalSpent)}
              subText="NGN"
            />
            <SummaryCard
              icon={<BadgeCheck />}
              label="Avg. Vendor Rating"
              value={summary.averageRating}
              rating
            />
          </div>

          <section className="mt-10">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black">Recent History</h2>

              <div className="flex gap-3">
                <button className="rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm">
                  Export CSV
                </button>
                <button className="rounded-xl border border-teal-700 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-teal-800">
                  Filter
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="mt-6 space-y-4 lg:hidden">
              {bookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="mt-6 hidden rounded-2xl bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <div className="min-w-245">
                  <div className="grid grid-cols-[280px_140px_140px_140px_150px_130px] bg-slate-50 px-8 py-5 text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                    <span>Vendor</span>
                    <span>Event Type</span>
                    <span>Event Date</span>
                    <span>Final Cost</span>
                    <span>Status</span>
                    <span className="text-right">Actions</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <BookingRow key={booking._id} booking={booking} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 border-t border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing 4 of {summary.totalEvents} completed bookings
                </p>

                <div className="flex items-center gap-3">
                  <button className="text-slate-600">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="rounded-lg bg-teal-800 px-4 py-3 text-sm font-bold text-white">
                    1
                  </button>
                  <button className="px-3 py-2 text-sm font-bold text-slate-500">
                    2
                  </button>
                  <button className="px-3 py-2 text-sm font-bold text-slate-500">
                    3
                  </button>
                  <button className="text-slate-600">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 grid overflow-hidden rounded-3xl bg-teal-800 p-8 text-white lg:grid-cols-[1fr_330px] lg:p-12">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-teal-200">
                Most Recent Success
              </p>

              <h2 className="mt-6 max-w-2xl text-3xl font-black leading-tight text-teal-100 sm:text-4xl">
                {summary.featured.vendor} provided an exceptional atmosphere for
                your Gala.
              </h2>

              <p className="mt-7 max-w-xl leading-7 text-teal-100/80">
                {summary.featured.description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-xl bg-white px-7 py-4 font-black text-teal-800">
                  Book Again
                </button>
                <button className="rounded-xl border border-teal-300 px-7 py-4 font-black text-white">
                  Contact Vendor
                </button>
              </div>
            </div>

            <div className="relative mt-10 lg:mt-0">
              <img
                src={summary.featured.image}
                alt={summary.featured.vendor}
                className="h-72 w-full rounded-2xl object-cover shadow-2xl"
              />

              <div className="absolute -bottom-6 left-6 rounded-xl bg-white p-4 text-slate-900 shadow-xl">
                <p className="font-black">Highly Recommended</p>
                <p className="text-xs text-slate-500">By 1,200+ clients</p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, subText, rating }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-sm">
      <div className="absolute -right-5 -top-5 text-slate-100">{icon}</div>

      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <h3 className="text-4xl font-black">{value}</h3>

        {rating && (
          <span className="flex text-orange-400">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} size={18} className="fill-orange-400" />
            ))}
          </span>
        )}

        {subText && (
          <span className="text-sm font-bold text-teal-800">{subText}</span>
        )}
      </div>
    </div>
  );
};

const BookingRow = ({ booking }) => {
  return (
    <>
      {/* Mobile / Tablet Card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm lg:hidden">
        <div className="flex items-start gap-4">
          <img
            src={booking.vendor.image}
            alt={booking.vendor.name}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-black leading-tight">
              {booking.vendor.name}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {booking.vendor.location}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Event Type
              </p>
              <p className="mt-1 font-black">{booking.eventType}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Event Date
              </p>
              <p className="mt-1 font-black">{booking.eventDate}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Final Cost
              </p>
              <p className="mt-1 font-black text-teal-800">
                {formatMoney(booking.finalCost)}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Status
              </p>
              <span className="mt-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-teal-800">
                <span className="h-2 w-2 rounded-full bg-teal-700" />
                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            to={`/user/bookings/${booking._id}`}
            className="rounded-xl bg-teal-800 px-4 py-3 text-center text-sm font-black text-white"
          >
            View Summary
          </Link>

          <button className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600">
            Receipt
          </button>
        </div>
      </div>

      {/* Desktop Row */}
      <div className="hidden gap-5 px-8 py-8 lg:grid lg:grid-cols-[280px_140px_140px_140px_150px_130px] lg:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src={booking.vendor.image}
            alt={booking.vendor.name}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />

          <div className="min-w-0">
            <h3 className="break-words text-base font-black leading-tight">
              {booking.vendor.name}
            </h3>
            <p className="mt-1 break-words text-sm text-slate-500">
              {booking.vendor.location}
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {booking.eventType}
        </span>

        <p className="font-medium">{booking.eventDate}</p>

        <p className="font-black">{formatMoney(booking.finalCost)}</p>

        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-teal-800">
          <span className="h-2 w-2 rounded-full bg-teal-700" />
          Completed
        </span>

        <div className="flex justify-end gap-2">
          <Link
            to={`/user/bookings/${booking._id}`}
            className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-black text-teal-800"
          >
            View
          </Link>

          <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
            Receipt
          </button>
        </div>
      </div>
    </>
  );
};
const formatMoney = (amount) => {
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });
};

const emptySummary = {
  user: {
    name: "EventSure user",
    role: "Event Planner",
    avatar: "/image1.png",
  },
  totalEvents: 0,
  totalSpent: 0,
  averageRating: null,
  featured: {
    vendor: "No completed bookings yet",
    description: "Completed bookings will appear here.",
    image: "/image1.png",
  },
};

export default CompletedBookings;
