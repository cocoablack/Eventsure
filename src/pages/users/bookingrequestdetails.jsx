import apiRequest, { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Bell,
  CalendarDays,
  MapPin,
  Users,
  Utensils,
  PartyPopper,
  Building2,
  Plus,
  MessageSquare,
  Check,
  Circle,
  Star,
  BadgeCheck,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const BookingRequestDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const cancelBooking = async () => {
    if (!window.confirm("Cancel this booking request?")) return;
    setActionMessage("");
    try {
      const { booking: updated } = await apiRequest(`/bookings/${bookingId}/cancel`, { method: "PATCH" });
      setBooking((current) => ({ ...current, status: updated.status }));
      setActionMessage("Booking request cancelled.");
    } catch (error) { setActionMessage(error.message); }
  };

  const openDispute = async () => {
    const reason = window.prompt("Brief reason for the dispute");
    if (!reason) return;
    const description = window.prompt("Describe what happened and the resolution you are seeking");
    if (!description) return;
    setActionMessage("");
    try {
      const { dispute } = await apiRequest("/disputes", { method: "POST", body: { bookingId, reason, description } });
      setActionMessage(`Dispute ${dispute.reference} was submitted.`);
    } catch (error) { setActionMessage(error.message); }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load booking details");
        }

        const item = data.booking;
        const iconFor = (title = "") => title.toLowerCase().includes("cater") ? Utensils : title.toLowerCase().includes("decor") ? PartyPopper : Building2;
        setBooking({ ...item, date: item.eventDate,
          user: { name: item.user?.fullName || "Event planner", avatar: item.user?.avatar || "/image1.png" },
          vendor: { ...item.vendor, name: item.vendor?.businessName || "Vendor", totalBookings: item.vendor?.completedJobs || 0, specialty: item.vendor?.category },
          services: (item.services || []).map((service) => ({ ...service, icon: iconFor(service.title) })),
          offer: item.offer ? { serviceFee: formatMoney(item.offer.proposal?.total || 0), managementFee: formatMoney(0), total: formatMoney(item.offer.proposal?.total || 0) } : { serviceFee: "No offer yet", managementFee: "—", total: "—" },
          progress: [{ title: "Request sent", description: `Current status: ${item.status}`, completed: true }],
        });
      } catch (error) {
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p role="alert" className="text-red-700">This booking could not be loaded.</p></div>;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <Link to="/user/bookings" className="hidden sm:block">
              <ArrowLeft size={24} className="text-slate-700" />
            </Link>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <h1 className="truncate text-sm font-black text-teal-900 sm:text-xl lg:text-2xl">
              Booking Request #{booking.reference}
            </h1>
          </div>

          <div className="hidden w-full max-w-sm items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Bell size={21} className="text-slate-700" />
            <div className="hidden items-center gap-3 sm:flex">
              <span className="font-bold text-teal-900">{booking.user.name}</span>
              <img
                src={booking.user.avatar}
                alt={booking.user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="grid min-w-0 gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6 sm:space-y-8">
            <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-800">
                    {booking.eventType}
                  </p>
                  <h2 className="mt-3 break-words text-2xl font-black sm:text-4xl">
                    {booking.title}
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-teal-50 px-5 py-2 text-sm font-bold text-teal-800">
                  {booking.status}
                </span>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InfoBlock icon={<CalendarDays />} label="Date & Time" value={booking.date} />
                <InfoBlock icon={<MapPin />} label="Location" value={booking.location} />
                <InfoBlock icon={<Users />} label="Guests" value={`${booking.guests} Attendees`} />
              </div>
            </section>

            <section className="min-w-0 rounded-2xl bg-slate-100 p-5 sm:p-8">
              <h2 className="text-xl font-black sm:text-2xl">Requested Services</h2>

              <div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {booking.services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <div key={service.title} className="min-w-0 rounded-2xl bg-white p-5 sm:p-6">
                      <Icon size={24} className="text-teal-800" />
                      <h3 className="mt-5 break-words text-lg font-bold">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid min-w-0 gap-6 lg:grid-cols-2">
              <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-xl font-black sm:text-2xl">Budget & Payment</h2>
                <p className="mt-3 text-sm text-slate-500 sm:text-base">
                  Allocated range for selected services
                </p>

                <h3 className="mt-6 break-words text-3xl font-black text-teal-800 sm:text-4xl">
                  {booking.budgetRange}
                </h3>

                <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:gap-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Payment Terms
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest text-teal-800">
                    {booking.paymentTerms}
                  </span>
                </div>
              </section>

              <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-xl font-black sm:text-2xl">Inspiration Uploads</h2>

                <div className="mt-6 flex flex-wrap gap-3">
                  {booking.inspirationImages.map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt="Inspiration"
                      className="h-20 w-24 rounded-lg object-cover"
                    />
                  ))}

                  <button className="flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400">
                    <Plus size={22} />
                    Add More
                  </button>
                </div>
              </section>
            </div>

            <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-black sm:text-2xl">Booking Progress</h2>

              <div className="mt-8 space-y-8">
                {booking.progress.map((item, index) => (
                  <ProgressStep
                    key={item.title}
                    item={item}
                    isLast={index === booking.progress.length - 1}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:h-fit">
            <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Vendor Partner
              </p>

              <div className="mt-6 flex items-center gap-4">
                <img
                  src={booking.vendor.logo}
                  alt={booking.vendor.name}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16"
                />

                <div className="min-w-0">
                  <h3 className="flex items-center gap-1 break-words text-base font-black text-teal-900 sm:text-lg">
                    {booking.vendor.name}
                    <BadgeCheck size={16} className="shrink-0" />
                  </h3>

                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <Star size={15} className="fill-orange-500 text-orange-500" />
                    <span className="font-bold text-orange-600">
                      {booking.vendor.rating}
                    </span>
                    <span className="text-slate-400">
                      ({booking.vendor.reviewCount} reviews)
                    </span>
                  </p>
                </div>
              </div>

              <SummaryRow label="Response Time" value={booking.vendor.responseTime} />
              <SummaryRow label="Total Bookings" value={booking.vendor.totalBookings} />
              <SummaryRow label="Specialty" value={booking.vendor.specialty} badge />

              <Link
                to={`/user/vendors/${booking.vendor._id}`}
                className="mt-6 block rounded-xl bg-slate-100 px-5 py-4 text-center font-bold text-teal-900"
              >
                View Profile
              </Link>
            </section>

            <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black sm:text-2xl">Current Offer Summary</h2>

              <div className="mt-6 rounded-2xl bg-slate-100 p-5">
                <OfferRow label="Service Fee" value={booking.offer.serviceFee} />
                <OfferRow label="Management Fee" value={booking.offer.managementFee} />

                <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-lg font-black">Total Offer</span>
                  <span className="break-words text-2xl font-black text-teal-800">
                    {booking.offer.total}
                  </span>
                </div>
              </div>

              <Link
                to={`/user/bookings/${booking._id}/offer`}
                className="mt-6 block rounded-xl bg-teal-800 px-5 py-4 text-center font-black text-white hover:bg-teal-900"
              >
                Review & Accept Offer
              </Link>

              <Link
                to="/user/messages"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700"
              >
                <MessageSquare size={18} />
                Send Message
              </Link>

              <button type="button" onClick={cancelBooking} disabled={!['pending', 'negotiating'].includes(booking.status)} className="mt-8 w-full text-sm font-black uppercase tracking-[0.25em] text-red-500 disabled:cursor-not-allowed disabled:text-slate-300">
                Cancel Request
              </button>
              <button type="button" onClick={openDispute} className="mt-4 w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-black text-red-700">Open a dispute</button>
              {actionMessage && <p role="status" className="mt-4 rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-700">{actionMessage}</p>}

              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                By accepting this offer, you agree to the EventSure Terms of
                Service and the vendor cancellation policy.
              </p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

const InfoBlock = ({ icon, label, value }) => (
  <div className="min-w-0">
    <p className="text-sm font-medium text-slate-400">{label}</p>
    <div className="mt-3 flex items-center gap-3">
      <span className="shrink-0 text-teal-800">{icon}</span>
      <span className="break-words text-base font-bold sm:text-lg">{value}</span>
    </div>
  </div>
);

const SummaryRow = ({ label, value, badge }) => (
  <div className="mt-5 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
    <span className="text-slate-500">{label}</span>
    {badge ? (
      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase">
        {value}
      </span>
    ) : (
      <span className="break-words font-black sm:text-right">{value}</span>
    )}
  </div>
);

const OfferRow = ({ label, value }) => (
  <div className="mb-4 flex items-center justify-between gap-4 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-black">{value}</span>
  </div>
);

const ProgressStep = ({ item, isLast }) => (
  <div className="relative flex min-w-0 gap-5">
    {!isLast && <div className="absolute left-3 top-8 h-full w-px bg-slate-200" />}

    <div
      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
        item.completed
          ? "bg-teal-700 text-white"
          : item.active
          ? "border-4 border-teal-700 bg-white"
          : "bg-slate-200 text-slate-400"
      }`}
    >
      {item.completed ? <Check size={16} /> : <Circle size={10} />}
    </div>

    <div className={`min-w-0 ${item.disabled ? "text-slate-300" : ""}`}>
      <h3 className="break-words font-black text-slate-800">{item.title}</h3>
      <p className="mt-1 break-words text-sm text-slate-500">
        {item.description}
      </p>

      {item.note && (
        <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-800">
          <strong>Action Required:</strong> {item.note}
        </div>
      )}
    </div>
  </div>
);

const formatMoney = (amount) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
}).format(Number(amount) || 0);

export default BookingRequestDetails;
