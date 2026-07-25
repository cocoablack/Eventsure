import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Mail,
  Bell,
  CalendarCheck,
  WalletCards,
  CalendarDays,
  MessageSquare,
  Plus,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const ActiveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    status: "All",
  });

  useEffect(() => {
    const fetchActiveBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams(filters).toString();

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/active?${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load active bookings");
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

    fetchActiveBookings();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading active bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <div className="hidden w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm sm:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings, vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-5 flex items-center gap-5 text-slate-700">
            <Mail size={22} />
            <Bell size={22} />
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">My Bookings</h1>
              <p className="mt-3 text-slate-500">
                Manage your active vendor contracts and event timelines.
              </p>
            </div>

            <div className="flex w-fit rounded-xl bg-slate-100 p-1">
              <button className="rounded-lg bg-white px-7 py-3 font-bold text-teal-800 shadow-sm">
                Active
              </button>
              <Link
                to="/user/bookings/completed"
                className="rounded-lg px-7 py-3 font-medium text-slate-500"
              >
                Completed
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <SummaryCard
              icon={<CalendarCheck />}
              label="Total Active Bookings"
              value={summary.totalActiveBookings}
              color="teal"
            />
            <SummaryCard
              icon={<WalletCards />}
              label="Pending Payments"
              value={formatMoney(summary.pendingPayments)}
              color="orange"
            />
            <SummaryCard
              icon={<CalendarDays />}
              label="Upcoming Events"
              value={summary.upcomingEvents}
              subText="in 30 days"
              color="blue"
            />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-100 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_170px_170px]">
              <div className="md:col-span-2 lg:col-span-1 flex items-center gap-3 rounded-xl bg-white px-5 py-4">
                <Search size={20} className="text-slate-400" />
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Filter by ID or Vendor Name..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="rounded-xl border-0 bg-white px-5 py-4 text-sm font-semibold outline-none"
              >
                <option>Category: All</option>
                <option>Catering</option>
                <option>Decoration</option>
                <option>Entertainment</option>
                <option>Hall Booking</option>
              </select>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="rounded-xl border-0 bg-white px-5 py-4 text-sm font-semibold outline-none"
              >
                <option>Status: All</option>
                <option>Negotiating</option>
                <option>Confirmed</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            {/* Mobile / Tablet Cards */}
            <div className="space-y-4 lg:hidden">
              {bookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden rounded-2xl bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <div className="min-w-275">
                  <div className="grid grid-cols-[130px_280px_150px_260px_160px_170px] bg-slate-100 px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>Booking ID</span>
                    <span>Vendor</span>
                    <span>Event Date</span>
                    <span>Payment Stage</span>
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
            </div>
          </div>

          <div className="mt-8 flex min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
              <Plus size={34} />
            </div>

            <h2 className="mt-5 text-xl font-black">Book another service?</h2>
            <p className="mt-2 max-w-md text-slate-500">
              Explore our curated list of top-tier vendors to make your event
              unforgettable.
            </p>

            <Link
              to="/user/browse-vendors"
              className="mt-6 font-black text-teal-800"
            >
              Browse Marketplace
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, subText, color }) => {
  const colors = {
    teal: "bg-teal-50 text-teal-800",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors[color]}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
          {label}
        </p>
        <h3 className="mt-2 text-2xl font-black sm:text-3xl">
          {value}{" "}
          {subText && (
            <span className="text-base font-medium text-slate-400">
              {subText}
            </span>
          )}
        </h3>
      </div>
    </div>
  );
};

const BookingRow = ({ booking }) => {
  return (
    <>
      {/* MOBILE + TABLET */}
      {/* <div className="block border-b border-slate-100 p-5 lg:hidden"> */}
      <div className="rounded-2xl border-b border-slate-100 bg-white p-5 shadow-sm lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/user/bookings/${booking._id}`}
            className="font-black text-teal-800"
          >
            #{booking.reference}
          </Link>

          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-5 flex items-start gap-4">
          <img
            src={booking.vendor.logo}
            alt={booking.vendor.name}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-black leading-tight">
              {booking.vendor.name}
            </h3>

            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              {booking.vendor.category}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Event Date
              </p>
              <p className="mt-1 font-black">{booking.eventDate}</p>
              <p className="text-sm text-slate-500">
                In {booking.daysLeft} days
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Payment
              </p>
              <p className="mt-1 font-bold text-teal-800">
                {booking.payment.label}
              </p>
              <p className="text-sm text-slate-500">
                {formatMoney(booking.payment.paid)} /{" "}
                {formatMoney(booking.payment.total)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-teal-700"
              style={{ width: `${booking.payment.percent}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to="/user/messages"
            className="rounded-xl bg-slate-100 p-3 text-teal-800"
          >
            <MessageSquare size={18} />
          </Link>

          <Link
            to={`/user/bookings/${booking._id}`}
            className="flex-1 rounded-xl bg-teal-800 px-4 py-3 text-center text-sm font-black text-white"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden gap-5 p-6 lg:grid lg:grid-cols-[130px_280px_150px_260px_160px_170px] lg:items-center lg:px-8 lg:py-8">
        <Link
          to={`/user/bookings/${booking._id}`}
          className="font-black text-teal-800"
        >
          #{booking.reference}
        </Link>

        <div className="flex items-center gap-4">
          <img
            src={booking.vendor.logo}
            alt={booking.vendor.name}
            className="h-11 w-11 rounded-lg object-cover"
          />

          <div>
            <h3 className="font-black">{booking.vendor.name}</h3>

            <p className="text-xs font-bold uppercase text-slate-400">
              {booking.vendor.category}
            </p>
          </div>
        </div>

        <div>
          <p className="font-black">{booking.eventDate}</p>

          <p className="text-sm text-slate-400">In {booking.daysLeft} days</p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <span className="text-teal-800">{booking.payment.label}</span>

            <span>
              {formatMoney(booking.payment.paid)} /
              {formatMoney(booking.payment.total)}
            </span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-teal-700"
              style={{
                width: `${booking.payment.percent}%`,
              }}
            />
          </div>
        </div>

        <StatusBadge status={booking.status} />

        <div className="flex items-center justify-end gap-4">
          <Link to="/user/messages" className="text-teal-800">
            <MessageSquare size={24} />
          </Link>

          <Link
            to={`/user/bookings/${booking._id}`}
            className="rounded-xl bg-teal-800 px-5 py-3 text-center text-sm font-black text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Negotiating: "bg-teal-100 text-teal-800",
    Confirmed: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
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
  totalActiveBookings: 0,
  pendingPayments: 0,
  upcomingEvents: 0,
};

export default ActiveBookings;
