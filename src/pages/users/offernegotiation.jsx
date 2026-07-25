import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Settings,
  Users,
  CalendarDays,
  WalletCards,
  Utensils,
  CheckCircle,
  PartyPopper,
  ShieldCheck,
  CreditCard,
  Lock,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const OfferNegotiation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/offer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load offer");
        }

        const item = data.offer;
        const money = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(amount) || 0);
        setOffer({ ...item, user: { ...item.user, name: item.user?.fullName || "Event planner", avatar: item.user?.avatar || "/image1.png" },
          vendor: { ...item.vendor, name: item.vendor?.businessName || "Vendor" },
          proposal: { ...item.proposal, total: money(item.proposal?.total) },
          breakdown: (item.breakdown || []).map((part) => ({ ...part, amount: money(part.amount) })), deposit: money(item.deposit), balance: money(item.balance),
        });
      } catch (error) {
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [bookingId]);

  const handleOfferAction = async (status) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/offer`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Offer action failed");
      }

      if (status === "accepted") {
        navigate(`/user/bookings/${bookingId}/payment`);
      } else {
        alert(`Offer ${status}`);
      }
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading offer...</p>
      </div>
    );
  }

  if (!offer) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p role="alert" className="text-red-700">No vendor offer is available for this booking.</p></div>;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link to="/user/browse-vendors">Marketplace</Link>
            <Link to="/user/messages">Direct Messages</Link>
            <Link to={`/user/bookings/${bookingId}/payment`}>Payment</Link>
          </nav>

          <div className="ml-auto flex items-center gap-4 text-slate-700 sm:gap-5">
            <Bell size={20} />
            <Settings size={20} />
            <img
              src={offer.user.avatar}
              alt={offer.user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </header>

        <section className="w-full max-w-full overflow-hidden px-4 py-8 pb-40 sm:px-6 lg:px-10">
          <Link
            to={`/user/bookings/${bookingId}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-800"
          >
            <ArrowLeft size={18} />
            Booking Details
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div className="min-w-0">
              <h1 className="max-w-3xl break-words text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                Offer Negotiation - {offer.vendor.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
                Reference: #{offer.reference}
              </p>
            </div>

            <div className="w-fit rounded-full bg-teal-800 px-5 py-3 text-xs font-black uppercase tracking-wider text-white sm:px-6 sm:py-4">
              Action Required - Review Counter-Offer
            </div>
          </div>

          <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-2">
            <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Your Original Request
              </p>

              <div className="mt-7 space-y-6 sm:mt-8 sm:space-y-7">
                <DetailRow
                  icon={<Users />}
                  label="Guest Count"
                  value={`${offer.originalRequest.guestCount} Guests`}
                />
                <DetailRow
                  icon={<CalendarDays />}
                  label="Preferred Date"
                  value={offer.originalRequest.date}
                />
                <DetailRow
                  icon={<WalletCards />}
                  label="Budget Range"
                  value={offer.originalRequest.budgetRange}
                />

                <div className="flex min-w-0 gap-4">
                  <Utensils className="mt-1 shrink-0 text-teal-800" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">Services Requested</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {offer.originalRequest.services.map((service) => (
                        <span
                          key={service}
                          className="break-words rounded-full bg-slate-100 px-3 py-1 text-xs font-bold"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="min-w-0 rounded-2xl border-b-4 border-teal-800 bg-white p-5 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-900">
                {offer.vendor.name}' Proposal
              </p>

              <div className="mt-7 space-y-6 sm:mt-8 sm:space-y-7">
                <DetailRow
                  icon={<CheckCircle />}
                  label="Confirmed Logistics"
                  value={`${offer.proposal.guestCount} Guests • ${offer.proposal.date}`}
                />

                <DetailRow
                  icon={<WalletCards />}
                  label="Total Professional Offer"
                  value={offer.proposal.total}
                  large
                  note="Includes seasonal peak-date premium"
                />

                <div className="flex min-w-0 gap-4">
                  <PartyPopper className="mt-1 shrink-0 text-teal-800" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">
                      Enhanced Service Scope
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {offer.proposal.services.map((service) => (
                        <span
                          key={service}
                          className="break-words rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-8 min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-black sm:text-2xl">
              Investment Breakdown
            </h2>

            <div className="mt-7 space-y-6 sm:mt-8 sm:space-y-7">
              {offer.breakdown.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 border-b border-slate-100 pb-5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <h3 className="break-words font-bold">{item.title}</h3>
                    <p className="mt-1 break-words text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-black">{item.amount}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
              <h3 className="text-base font-black uppercase sm:text-xl">
                Total Contract Value
              </h3>
              <p className="break-words text-2xl font-black text-teal-800 sm:text-3xl">
                {offer.proposal.total}
              </p>
            </div>

            <div className="mt-8 grid min-w-0 gap-5 md:grid-cols-2">
              <div className="min-w-0 rounded-2xl border-l-4 border-teal-800 bg-teal-50 p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-widest text-teal-900">
                  Due Now: 30% Deposit
                </p>
                <h3 className="mt-2 break-words text-2xl font-black">
                  {offer.deposit}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Required to secure date and commence planning.
                </p>
              </div>

              <div className="min-w-0 rounded-2xl bg-slate-100 p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Final Balance: 70%
                </p>
                <h3 className="mt-2 break-words text-2xl font-black">
                  {offer.balance}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Due after event completion confirmation.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-3">
            <PolicyBlock
              icon={<ShieldCheck />}
              title="Cancellation Policy"
              items={[
                "Full refund of deposit if cancelled 60+ days before event.",
                "50% refund if cancelled 30–59 days before.",
                "Non-refundable within 30 days.",
              ]}
            />
            <PolicyBlock
              icon={<CheckCircle />}
              title="Service Guarantees"
              items={[
                "All dietary restrictions managed via digital portal.",
                "Vendor carries liability insurance.",
                "Guaranteed setup completion before event.",
              ]}
            />
            <PolicyBlock
              icon={<CreditCard />}
              title="Payment Schedule"
              items={[
                "Payments processed securely via EventSure Pay.",
                "Taxes and gratuities are inclusive in quote.",
                "Receipts generated automatically.",
              ]}
            />
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 bg-white px-4 py-4 shadow-2xl sm:px-6 lg:left-72 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest">
                Assigned to your event
              </p>
              <h4 className="break-words font-black">
                {offer.vendor.name} Premium Team
              </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:flex md:flex-wrap md:justify-end">
              <button
                onClick={() => handleOfferAction("rejected")}
                disabled={actionLoading}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Reject
              </button>

              <button
                onClick={() => handleOfferAction("changes_requested")}
                disabled={actionLoading}
                className="rounded-xl px-4 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50"
              >
                Request Changes
              </button>

              <button
                onClick={() => handleOfferAction("accepted")}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-3 text-sm font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70 sm:px-6"
              >
                Accept & Pay
                <Lock size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DetailRow = ({ icon, label, value, large, note }) => (
  <div className="flex min-w-0 gap-4">
    <span className="mt-1 shrink-0 text-teal-800">{icon}</span>
    <div className="min-w-0">
      <p className="text-sm text-slate-500">{label}</p>
      <h3
        className={`break-words font-black ${
          large ? "text-2xl text-teal-800 sm:text-3xl" : "text-base sm:text-lg"
        }`}
      >
        {value}
      </h3>
      {note && <p className="mt-1 text-xs italic text-slate-500">{note}</p>}
    </div>
  </div>
);

const PolicyBlock = ({ icon, title, items }) => (
  <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-teal-800">{icon}</span>
      <h3 className="break-words text-sm font-black uppercase tracking-widest">
        {title}
      </h3>
    </div>

    <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

export default OfferNegotiation;
