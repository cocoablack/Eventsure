import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/users/UserSidebar.jsx";
import apiRequest from "../../services/api.js";

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const useCollection = (path, key) => {
  const [state, setState] = useState({ loading: true, error: "", records: [] });
  const load = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    apiRequest(path)
      .then((data) => setState({ loading: false, error: "", records: data[key] || [] }))
      .catch((error) => setState({ loading: false, error: error.message || "Unable to load records.", records: [] }));
  }, [key, path]);
  useEffect(() => {
    let active = true;
    apiRequest(path)
      .then((data) => { if (active) setState({ loading: false, error: "", records: data[key] || [] }); })
      .catch((error) => { if (active) setState({ loading: false, error: error.message || "Unable to load records.", records: [] }); });
    return () => { active = false; };
  }, [key, path]);
  return { ...state, load };
};

const Layout = ({ title, description, children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-950">
    <UserSidebar />
    <main className="px-5 py-10 lg:ml-72 lg:px-10">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700">Planner workspace</p>
      <h1 className="mt-2 text-3xl font-black">{title}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">{description}</p>
      <div className="mt-8">{children}</div>
    </main>
  </div>
);

const CollectionState = ({ state }) => {
  if (state.loading) return <div className="rounded-3xl bg-white p-10 text-slate-500">Loading live data…</div>;
  if (state.error) return <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800"><p className="font-bold">{state.error}</p><button type="button" onClick={state.load} className="mt-4 rounded-xl bg-red-700 px-4 py-2 font-bold text-white">Try again</button></div>;
  if (!state.records.length) return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No records yet.</div>;
  return null;
};

export const UserOffers = () => {
  const state = useCollection("/bookings/offers", "offers");
  return <Layout title="Offers" description="Review every vendor proposal linked to your account.">
    <CollectionState state={state} />
    {!!state.records.length && <div className="grid gap-5">{state.records.map((offer) => <article key={offer._id} className="rounded-3xl bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="text-xs font-black uppercase tracking-wider text-slate-500">{offer.reference}</p><h2 className="mt-2 text-xl font-black">{offer.vendor?.businessName || "Vendor offer"}</h2><p className="mt-2 text-sm text-slate-600">{offer.booking?.title || "Booking"} · <span className="capitalize">{offer.status.replace("_", " ")}</span></p><p className="mt-3 font-black text-teal-800">{money.format(offer.proposal?.total || 0)}</p></div><Link to={`/user/bookings/${offer.booking?._id || offer.booking}/offer`} className="mt-5 inline-block rounded-xl bg-teal-800 px-5 py-3 text-center font-black text-white sm:mt-0">Review offer</Link></article>)}</div>}
  </Layout>;
};

export const UserPayments = () => {
  const state = useCollection("/payments", "payments");
  return <Layout title="Payments" description="Server-verified Paystack transactions for your bookings.">
    <CollectionState state={state} />
    {!!state.records.length && <div className="overflow-x-auto rounded-3xl bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-100"><tr><th className="px-5 py-4">Reference</th><th className="px-5 py-4">Booking</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Date</th></tr></thead><tbody>{state.records.map((payment) => <tr key={payment._id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-4 font-bold">{payment.reference}</td><td className="px-5 py-4"><Link className="text-teal-800" to={`/user/bookings/${payment.booking?._id || payment.booking}/payment`}>{payment.booking?.title || "View booking"}</Link></td><td className="px-5 py-4">{money.format((payment.amountKobo || 0) / 100)}</td><td className="px-5 py-4 capitalize">{payment.status}</td><td className="px-5 py-4">{new Date(payment.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}
  </Layout>;
};
