import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  HelpCircle,
  Lock,
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  BadgeCheck,
  Shield,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const Payment = () => {
  const { bookingId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [billing, setBilling] = useState({
    fullName: "",
    email: "",
    billingAddress: "",
  });

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const reference = new URLSearchParams(window.location.search).get("reference");
        if (reference) {
          const verification = await apiFetch(`${import.meta.env.VITE_API_URL}/api/payments/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${token}` } });
          if (!verification.ok) {
            const failed = await verification.json();
            throw new Error(failed.message || "Payment verification failed");
          }
        }

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/payments/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load payment details");
        }

        const mapped = {
          user: { name: data.booking.user?.fullName || "Event planner", email: data.booking.user?.email || "", billingAddress: "", avatar: data.booking.user?.avatar || "/image1.png" },
          vendor: { name: data.booking.vendor?.businessName || "Vendor", image: data.booking.vendor?.logo || "/image1.png" },
          eventType: data.booking.eventType, eventDate: data.booking.eventDate,
          baseAmount: data.summary.totalAmount, platformFee: 0, totalAmount: data.summary.totalAmount,
          depositAmount: data.summary.nextPaymentAmount, finalBalance: Math.max(data.summary.totalAmount - data.summary.amountPaid - data.summary.nextPaymentAmount, 0),
          nextPaymentType: data.summary.nextPaymentType,
        };
        setPaymentData(mapped);
        setBilling({
          fullName: mapped.user.name,
          email: mapped.user.email,
          billingAddress: "",
        });
      } catch (error) {
        setPaymentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [bookingId]);

  const handleBillingChange = (e) => {
    setBilling((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = async () => {
    try {
      setPaying(true);
      const token = localStorage.getItem("token");

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/payments/booking/${bookingId}/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentType: paymentData.nextPaymentType,
            paymentMethod,
            billing,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      if (data.payment?.authorizationUrl) {
        window.location.href = data.payment.authorizationUrl;
      } else {
        throw new Error("Payment provider did not return a checkout URL");
      }
    } catch (error) {
      alert(error.message || "Unable to complete payment.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading payment page...</p>
      </div>
    );
  }

  if (!paymentData) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p role="alert" className="text-red-700">Payment details are unavailable. Confirm the booking offer before paying.</p></div>;

  const payment = paymentData;

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
              placeholder="Search payments or vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-5 flex items-center gap-5 text-slate-700">
            <HelpCircle size={21} />
            <Lock size={21} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-bold">{payment.user.name}</h4>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Premium Member
                </p>
              </div>

              <img
                src={payment.user.avatar}
                alt={payment.user.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="grid min-w-0 gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0 space-y-8">
            <SectionTitle number="01" title="Booking Details" />

            <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
                <img
                  src={payment.vendor.image}
                  alt={payment.vendor.name}
                  className="h-56 w-full rounded-xl object-cover md:h-52"
                />

                <div>
                  <span className="rounded-full bg-teal-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-teal-800">
                    Confirmed Vendor
                  </span>

                  <h1 className="mt-6 text-4xl font-black leading-tight">
                    {payment.vendor.name}
                  </h1>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Event Type
                      </p>
                      <p className="mt-2 font-bold">{payment.eventType}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Event Date
                      </p>
                      <p className="mt-2 font-bold">{payment.eventDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <SectionTitle number="02" title="Financial Structure" />

            <div className="grid min-w-0 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-teal-800" />
                  <h2 className="text-2xl font-black leading-tight">
                    Staged Release Details
                  </h2>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="rounded-xl border-l-4 border-teal-800 bg-teal-50 p-5">
                    <p className="text-lg font-bold">Due Now</p>
                    <p className="text-lg font-bold">(30% Deposit)</p>
                    <h3 className="mt-2 text-2xl font-black text-teal-800">
                      {formatMoney(payment.depositAmount)}
                    </h3>
                    <p className="mt-2 text-sm italic text-slate-500">
                      Secures the date and initial logistics.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-5">
                    <p className="text-lg font-bold">Final Balance</p>
                    <p className="text-lg font-bold">(70%)</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-500">
                      {formatMoney(payment.finalBalance)}
                    </h3>
                    <p className="mt-2 text-sm italic text-slate-400">
                      Released after completion confirmation.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-black">Financial Breakdown</h2>

                <div className="mt-8 space-y-5">
                  <BreakdownRow
                    label="Base Amount"
                    value={payment.baseAmount}
                  />
                  <BreakdownRow
                    label="Platform Service Fee (10%)"
                    value={payment.platformFee}
                  />

                  <div className="flex flex-col gap-2 border-t border-slate-100 pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <span className="text-lg font-black">Total Amount</span>
                    <span className="wrap-break-word text-2xl font-black sm:text-3xl">
                      {formatMoney(payment.totalAmount)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <SectionTitle number="03" title="Secure Payment" />

            <section>
              <div className="grid gap-5 md:grid-cols-3">
                <PaymentMethod
                  active={paymentMethod === "card"}
                  icon={<CreditCard />}
                  title="Credit/Debit Card"
                  subtitle="VISA, MC, AMEX"
                  onClick={() => setPaymentMethod("card")}
                />
                <PaymentMethod
                  active={paymentMethod === "bank"}
                  icon={<Building2 />}
                  title="Bank Transfer"
                  subtitle="WIRE, ACH, SEPA"
                  onClick={() => setPaymentMethod("bank")}
                />
                <PaymentMethod
                  active={paymentMethod === "wallet"}
                  icon={<Wallet />}
                  title="Secure Wallet"
                  subtitle="APPLE, GOOGLE PAY"
                  onClick={() => setPaymentMethod("wallet")}
                />
              </div>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Full Legal Name"
                    name="fullName"
                    value={billing.fullName}
                    onChange={handleBillingChange}
                    placeholder="e.g. Alex Thompson"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={billing.email}
                    onChange={handleBillingChange}
                    placeholder="alex@corporate.com"
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Billing Address"
                      name="billingAddress"
                      value={billing.billingAddress}
                      onChange={handleBillingChange}
                      placeholder="123 Gallery Way, Creative District"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="min-w-0 space-y-6 xl:order-0">
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-28">
              <h2 className="text-xl font-black sm:text-2xl">Order Summary</h2>

              <div className="mt-8 flex items-start justify-between">
                <div>
                  <p className="font-black">Deposit Amount</p>
                  <p className="text-sm text-slate-400">30% upfront payment</p>
                </div>
                <p className="text-lg font-black sm:text-xl">
                  {formatMoney(payment.depositAmount)}
                </p>
              </div>

              <div className="my-8 border-t border-slate-100" />

              <div className="flex items-center justify-between">
                <p className="text-slate-500">Service Taxes</p>
                <p className="font-bold">Included</p>
              </div>

              <div className="mt-8 rounded-xl bg-teal-50 p-5">
                <div className="flex gap-3">
                  <BadgeCheck size={18} className="shrink-0 text-teal-800" />
                  <p className="text-sm font-medium leading-6 text-teal-800">
                    Your payment is held securely and only released to the
                    vendor based on the agreed release stages.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                  Total To Pay Today
                </p>
                <h3 className="mt-2 text-2xl font-black text-teal-800 sm:text-3xl">
                  {formatMoney(payment.depositAmount)}
                </h3>
              </div>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="mt-6 w-full rounded-xl bg-teal-800 px-5 py-4 text-sm font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70 sm:text-base"
              >
                {paying ? "Processing..." : "Complete Secure Payment"}
              </button>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <TrustCard icon={<BadgeCheck />} label="PCI-DSS Compliant" />
              <TrustCard icon={<Shield />} label="Bank-Level SSL" />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

const SectionTitle = ({ number, title }) => {
  return (
    <div className="flex items-center gap-5">
      <p className="text-sm font-black uppercase tracking-[0.35em] text-teal-800">
        {number}. {title}
      </p>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
};

const BreakdownRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <p className="text-slate-500">{label}</p>
      <p className="font-black">{formatMoney(value)}</p>
    </div>
  );
};

const PaymentMethod = ({ active, icon, title, subtitle, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-6 text-left transition ${
        active
          ? "border-teal-800 bg-teal-50"
          : "border-transparent bg-white hover:border-teal-200"
      }`}
    >
      <div className="text-slate-400">{icon}</div>
      <h3 className="mt-7 font-black">{title}</h3>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        {subtitle}
      </p>
    </button>
  );
};

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      <input
        {...props}
        className="mt-3 w-full bg-slate-100 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700"
      />
    </div>
  );
};

const TrustCard = ({ icon, label }) => {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <div className="flex justify-center text-slate-400">{icon}</div>
      <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </div>
  );
};

const formatMoney = (amount) => {
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
};

export default Payment;
