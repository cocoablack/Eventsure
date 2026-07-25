import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Bell,
  Mail,
  User,
  PartyPopper,
  MapPin,
  CalendarDays,
  Users,
  FileText,
  WalletCards,
  Camera,
  Video,
  Plane,
  Clock,
  Send,
} from "lucide-react";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const OfferResponse = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    counterPrice: "",
    selectedServices: [],
    timeline: "",
    notes: "",
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/booking-requests/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load request");
        }

        setRequest(data.request);
        setFormData((current) => ({ ...current, selectedServices: (data.request.services || []).map((service) => service.name) }));
      } catch (error) {
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((item) => item !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleSubmit = async (action) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/booking-requests/${requestId}/response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit response");
      }

      alert("Response submitted successfully.");
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading request...</p>
      </div>
    );
  }

  if (!request) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p role="alert" className="text-red-700">This booking request could not be loaded.</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Bell size={22} />
            <Mail size={22} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black">{request.vendor.name}</h4>
                <p className="text-xs text-slate-500">Premium Vendor</p>
              </div>
              <img
                src={request.vendor.avatar}
                alt={request.vendor.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="grid gap-8 px-5 py-10 xl:grid-cols-[1fr_360px] lg:px-10">
          <div>
            <p className="text-sm text-slate-600">
              Booking Requests <span className="mx-2">›</span>{" "}
              <span className="font-bold text-slate-950">{request.title}</span>
            </p>

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-3xl font-black">Review & Counter-Offer</h1>
                  <p className="mt-3 max-w-xl text-lg leading-7 text-slate-600">
                    Adjust the terms to best fit your studio's availability and
                    quality standards.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-teal-50 px-6 py-3 text-xs font-black uppercase tracking-widest text-teal-800">
                  Pending Response
                </span>
              </div>

              <div className="my-8 border-t border-slate-100" />

              <FormSection icon={<WalletCards />} title="Price Adjustment">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-100 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Client Budget
                    </p>
                    <h3 className="mt-3 text-2xl font-black">
                      {formatMoney(request.clientBudget)}
                    </h3>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Your Counter Price
                    </label>
                    <input
                      type="number"
                      value={formData.counterPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          counterPrice: e.target.value,
                        }))
                      }
                      className="mt-3 w-full border-b border-slate-300 bg-transparent px-3 py-5 text-2xl font-black outline-none focus:border-teal-800"
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection icon={<Camera />} title="Service Scope">
                <div className="grid gap-4 md:grid-cols-3">
                  {request.services.map((service) => (
                    <ServiceToggle
                      key={service.name}
                      service={service}
                      active={formData.selectedServices.includes(service.name)}
                      onClick={() => toggleService(service.name)}
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm italic text-slate-600">
                  Note: Uncheck services you cannot provide for this specific
                  request.
                </p>
              </FormSection>

              <FormSection icon={<Clock />} title="Delivery Timeline">
                <select
                  value={formData.timeline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeline: e.target.value,
                    }))
                  }
                  className="w-full border-b border-slate-300 bg-slate-100 px-5 py-5 text-lg outline-none focus:border-teal-800"
                >
                  <option>Standard: 4-6 Weeks for full gallery</option>
                  <option>Express: 2-3 Weeks with added fee</option>
                  <option>Flexible: Timeline to be discussed</option>
                </select>
              </FormSection>

              <FormSection icon={<Send />} title="Additional Notes & Terms">
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows="6"
                  placeholder="Briefly explain your price adjustment or service modifications..."
                  className="w-full resize-none rounded-xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-teal-800"
                />
              </FormSection>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-2xl bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <InfoIcon />
                <h2 className="text-2xl font-black">Event Summary</h2>
              </div>

              <div className="mt-8 space-y-7">
                <SummaryItem icon={<User />} label="Client" value={request.client} />
                <SummaryItem
                  icon={<PartyPopper />}
                  label="Event Type"
                  value={request.title}
                />
                <SummaryItem
                  icon={<MapPin />}
                  label="Location"
                  value={request.location}
                />

                <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Date
                    </p>
                    <p className="mt-2 font-black">{request.date}</p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Guests
                    </p>
                    <p className="mt-2 font-black">{request.guests} Guests</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.25em]">
                  Inspiration
                </h2>
                <button className="font-black text-teal-800">View All</button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {request.inspiration.map((item) =>
                  item.type === "image" ? (
                    <img
                      key={item.id}
                      src={item.url}
                      alt="Inspiration"
                      className="h-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      key={item.id}
                      className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100"
                    >
                      <FileText size={22} />
                      <p className="mt-2 text-xs font-bold">PDF</p>
                    </div>
                  )
                )}
              </div>
            </section>
          </aside>
        </section>

        <div className="sticky bottom-0 z-30 border-t border-slate-100 bg-white px-5 py-5 shadow-2xl lg:px-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-end">
            <button
              disabled={submitting}
              onClick={() => handleSubmit("rejected")}
              className="rounded-xl px-7 py-4 font-black text-slate-800 hover:bg-slate-100"
            >
              Reject Request
            </button>

            <button
              disabled={submitting}
              onClick={() => handleSubmit("accepted")}
              className="rounded-xl border-2 border-teal-800 px-7 py-4 font-black text-teal-800"
            >
              Accept Original Request
            </button>

            <button
              disabled={submitting}
              onClick={() => handleSubmit("counter_offer")}
              className="rounded-xl bg-teal-800 px-8 py-4 font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send Counter-Offer"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const FormSection = ({ icon, title, children }) => {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-teal-800">{icon}</span>
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
};

const ServiceToggle = ({ service, active, onClick }) => {
  const iconMap = {
    Photography: Camera,
    Videography: Video,
    "Aerial Drone": Plane,
  };

  const Icon = iconMap[service.name] || Camera;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl px-5 py-4 text-left font-bold ${
        active ? "bg-teal-50 text-teal-900" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded ${
            active ? "bg-teal-800 text-white" : "border border-slate-300"
          }`}
        >
          {active && "✓"}
        </span>
        {service.name}
      </span>
      <Icon size={22} />
    </button>
  );
};

const SummaryItem = ({ icon, label, value }) => {
  return (
    <div className="flex gap-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-lg font-black">{value}</p>
      </div>
    </div>
  );
};

const InfoIcon = () => {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-teal-800 text-sm font-black text-teal-800">
      i
    </div>
  );
};

const formatMoney = (amount) => {
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
};

export default OfferResponse;
