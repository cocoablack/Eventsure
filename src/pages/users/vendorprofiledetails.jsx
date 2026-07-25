import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Search,
  Mail,
  Bell,
  Star,
  BadgeCheck,
  MapPin,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Send,
  ArrowLeft,
  CheckCircle,
  Image,
  WalletCards,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const VendorProfileDetails = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/vendors/${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load vendor");
        }

        setVendor(data.vendor);
        setSaved(data.vendor.isSaved || false);
      } catch (error) {
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleSaveVendor = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/saved-vendors/${vendorId}`, {
        method: saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Unable to update saved vendor");

      setSaved((prev) => !prev);
    } catch (error) {
      console.log(error);
      alert(error.message || "Unable to update saved vendor.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading vendor profile...</p>
      </div>
    );
  }

  if (!vendor) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p role="alert" className="text-red-700">This vendor could not be loaded.</p></div>;

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

          <div className="hidden w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search vendors, services, or bookings..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-4 text-slate-700 sm:gap-5">
            <Mail size={21} />
            <Bell size={21} />
          </div>
        </header>

        <section className="w-full max-w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <Link
            to="/user/browse-vendors"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-800"
          >
            <ArrowLeft size={17} />
            Back to vendors
          </Link>

          <div className="mt-6 min-w-0 overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-56 bg-gradient-to-br from-teal-100 to-slate-300 sm:h-72">
              {vendor.coverImage && (
                <img
                  src={vendor.coverImage}
                  alt={vendor.businessName}
                  className="h-full w-full object-cover"
                />
              )}

              <button
                type="button"
                onClick={handleSaveVendor}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm sm:right-6 sm:top-6 sm:h-12 sm:w-12"
              >
                <Heart
                  size={22}
                  className={saved ? "fill-teal-700 text-teal-700" : ""}
                />
              </button>
            </div>

            <div className="grid min-w-0 gap-8 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-800">
                    <BadgeCheck size={14} />
                    Verified Vendor
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {vendor.category}
                  </span>

                  <span className="flex items-center gap-1 text-sm font-bold">
                    <Star
                      size={16}
                      className="fill-orange-500 text-orange-500"
                    />
                    {vendor.rating} ({vendor.reviewCount} reviews)
                  </span>
                </div>

                <h1 className="mt-5 break-words text-3xl font-black sm:text-4xl lg:text-5xl">
                  {vendor.businessName}
                </h1>

                <p className="mt-3 break-words text-slate-500">
                  @{vendor.username}
                </p>

                <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-5">
                  <span className="flex items-center gap-2">
                    <MapPin size={17} className="shrink-0" />{" "}
                    <span className="break-words">{vendor.location}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={17} className="shrink-0" /> Available this
                    month
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={17} className="shrink-0" />{" "}
                    {vendor.completedJobs}+ completed jobs
                  </span>
                </div>

                <p className="mt-8 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  {vendor.description}
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Starting at
                </p>
                <h3 className="mt-2 break-words text-3xl font-black text-teal-800">
                  ${vendor.startingPrice.toLocaleString()}
                </h3>

                <div className="mt-6 space-y-3">
                  <Link
                    to={`/user/vendors/${vendor._id}/book`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-4 text-sm font-bold text-white hover:bg-teal-900 sm:text-base"
                  >
                    Send Booking Request <Send size={18} />
                  </Link>

                  <Link
                    to={`/user/messages?vendor=${vendor._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 sm:text-base"
                  >
                    Message Vendor <MessageSquare size={18} />
                  </Link>
                </div>

                <div className="mt-6 rounded-xl bg-white p-4">
                  <h4 className="font-bold">Payment Protection</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Payments are tracked through EventSure with staged vendor
                    release after booking confirmation and job completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-8">
              <Card title="Services Offered">
                <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {vendor.services.map((service) => (
                    <div
                      key={service}
                      className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <CheckCircle size={22} className="text-teal-800" />
                      <h4 className="mt-4 break-words font-bold">{service}</h4>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Portfolio Gallery">
                <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {vendor.gallery.map((item, index) => (
                    <div
                      key={index}
                      className="h-44 min-w-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-48"
                    >
                      {item ? (
                        <img
                          src={item}
                          alt="Vendor portfolio"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Image className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Customer Reviews">
                <div className="space-y-5">
                  {vendor.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="break-words font-bold">
                            {review.name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {review.eventType}
                          </p>
                        </div>

                        <span className="flex w-fit items-center gap-1 font-bold text-orange-600">
                          <Star size={15} className="fill-orange-500" />
                          {review.rating}
                        </span>
                      </div>

                      <p className="mt-4 break-words text-sm leading-7 text-slate-600">
                        “{review.comment}”
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <aside className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:h-fit">
              <Card title="Vendor Summary">
                <SummaryRow label="Verification" value="Approved" />
                <SummaryRow label="Probation" value="Completed" />
                <SummaryRow label="Response Time" value={vendor.responseTime} />
                <SummaryRow label="Location" value={vendor.location} />
                <SummaryRow
                  label="Starting Price"
                  value={`$${vendor.startingPrice.toLocaleString()}`}
                />
              </Card>

              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 sm:p-6">
                <WalletCards className="text-teal-800" />
                <h3 className="mt-4 font-bold text-teal-950">
                  Send Your Budget
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Share your estimated budget so this vendor can respond with a
                  suitable offer.
                </p>
                <Link
                  to={`/user/vendors/${vendor._id}/book`}
                  className="mt-5 block rounded-xl bg-teal-800 px-5 py-3 text-center text-sm font-bold text-white"
                >
                  Send Budget
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

const Card = ({ title, children }) => {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <h2 className="break-words text-xl font-black sm:text-2xl">{title}</h2>
      <div className="mt-6 min-w-0">{children}</div>
    </section>
  );
};

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-4 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="break-words font-bold text-slate-900 sm:text-right">
        {value}
      </span>
    </div>
  );
};

export default VendorProfileDetails;
