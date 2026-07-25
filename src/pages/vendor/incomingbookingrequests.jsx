import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  HelpCircle,
  Heart,
  BriefcaseBusiness,
  Cake,
  MapPin,
  CalendarDays,
  Users,
  Clock,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import { Link } from "react-router-dom";

const IncomingBookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "All Categories",
    status: "All Status",
    sortBy: "Newest First",
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams(filters).toString();

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/bookings/incoming?${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load booking requests");
        }

        setRequests((data.bookings || []).map((booking) => ({
          _id: booking._id, title: booking.title, category: booking.eventType,
          location: booking.location, date: booking.eventDate, guests: booking.guests,
          budget: booking.totalAmount || 0, status: booking.status,
          services: (booking.services || []).map((service) => service.title),
          icon: booking.eventType?.toLowerCase().includes("wedding") ? Heart : booking.eventType?.toLowerCase().includes("corporate") ? BriefcaseBusiness : Cake,
          iconBg: "bg-teal-100", iconColor: "text-teal-700",
        })));
      } catch (error) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filters]);

  const handleRequestAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/bookings/${requestId}/respond`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: action === "accept" ? "accepted" : "rejected" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Action failed");
      }

      if (action === "reject") {
        setRequests((prev) => prev.filter((item) => item._id !== requestId));
      }

      alert(`Request ${action} successful.`);
    } catch (error) {
      alert(error.message || "Unable to complete action.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading booking requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 lg:px-10">
          <div className="hidden items-center gap-8 text-lg font-semibold text-slate-500 md:flex">
            <span>Overview</span>
            <span className="font-black text-teal-800">Requests</span>
            <span>Calendar</span>
          </div>

          <div className="ml-auto flex items-center gap-6 text-slate-700">
            <Bell size={22} />
            <Mail size={22} />
            <HelpCircle size={22} />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop"
              alt="Vendor"
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>
        </header>

        <section className="px-5 py-10 lg:px-10">
          <h1 className="text-3xl font-black sm:text-5xl">
            Incoming Booking Requests
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            You have{" "}
            <span className="font-black text-teal-800">
              {requests.length} pending inquiries
            </span>{" "}
            requiring your attention this week.
          </p>

          <div className="mt-10 rounded-2xl bg-slate-100 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="rounded-xl bg-white px-5 py-4 font-semibold outline-none"
              >
                <option>All Categories</option>
                <option>Wedding</option>
                <option>Corporate</option>
                <option>Birthday</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="rounded-xl bg-white px-5 py-4 font-semibold outline-none"
              >
                <option>All Status</option>
                <option>New Inquiry</option>
                <option>Negotiating</option>
              </select>

              <button className="flex items-center gap-3 rounded-xl px-5 py-4 font-black text-slate-600">
                <SlidersHorizontal size={19} />
                Advanced Filters
              </button>

              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                  Sort By
                </span>
                <span className="font-black text-teal-800">Newest First</span>
                <ArrowUpDown size={20} className="text-teal-800" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-2">
            {requests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onAction={handleRequestAction}
              />
            ))}

            <SpotlightPromo />
          </div>

          <div className="mt-12 flex justify-center">
            <button className="rounded-full bg-white px-10 py-4 font-black text-slate-600 shadow-sm">
              View Archive Requests
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const RequestCard = ({ request, onAction }) => {
  const Icon = request.icon;

  return (
    <section className="rounded-3xl bg-white p-7 shadow-sm">
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
        <div className="flex items-start gap-5">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${request.iconBg}`}
          >
            <Icon size={26} className={request.iconColor} />
          </div>

          <div>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-teal-800">
              {request.category}
            </span>

            <h2 className="mt-3 text-2xl font-black leading-tight">
              {request.title}
            </h2>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <h3 className="text-3xl font-black text-teal-800">
            {formatMoney(request.budget)}
          </h3>
          <p className="mt-1 text-sm text-slate-500">Total Budget</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Info icon={<MapPin />} text={request.location} />
        <Info icon={<CalendarDays />} text={request.date} />
        <Info icon={<Users />} text={`${request.guests} Guests`} />
        <Info
          icon={<Clock />}
          text={request.status}
          highlight={request.status === "New Inquiry"}
        />
      </div>

      <div className="mt-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
          Required Services
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {request.services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row">
        {request.status === "Negotiating" ? (
          <>
            <button className="rounded-xl bg-teal-800 px-6 py-4 font-black text-white shadow-lg">
              View Thread
            </button>

            <button className="rounded-xl border border-teal-800 px-6 py-4 font-black text-teal-800">
              Send New Proposal
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAction(request._id, "accept")}
              className="rounded-xl bg-teal-800 px-6 py-4 font-black text-white shadow-lg"
            >
              Accept Request
            </button>

            <Link
              to={`/vendor/booking-requests/${request._id}/respond`}
              className="rounded-xl border border-teal-800 px-6 py-4 font-black text-teal-800"
            >
              Send Counter-Offer
            </Link>
          </>
        )}

        <button
          onClick={() => onAction(request._id, "reject")}
          className="rounded-xl border border-slate-200 px-5 py-4 text-slate-400"
        >
          <X size={24} />
        </button>
      </div>
    </section>
  );
};

const Info = ({ icon, text, highlight }) => {
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className={highlight ? "font-black text-teal-800" : ""}>{text}</span>
    </div>
  );
};

const SpotlightPromo = () => {
  return (
    <section className="rounded-3xl bg-teal-800 p-9 text-white shadow-xl">
      <Star size={36} />

      <h2 className="mt-8 max-w-md text-4xl font-black leading-tight">
        Maximize Your Earnings with Spotlight
      </h2>

      <p className="mt-5 max-w-md text-lg leading-8 text-teal-50/80">
        Spotlight placement can increase marketplace visibility when billing is enabled.
      </p>

      <button className="mt-8 rounded-full bg-white px-10 py-4 font-black text-teal-800">
        Upgrade Now
      </button>

      <div className="mt-14 border-t border-white/20 pt-8">
        <p className="text-sm font-black uppercase tracking-widest">
          + 150 vendors went pro
        </p>
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

export default IncomingBookingRequests;
