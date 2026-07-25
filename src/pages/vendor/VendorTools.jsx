import { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar.jsx";
import apiRequest from "../../services/api.js";

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const Layout = ({ title, description, children }) => <div className="min-h-screen bg-slate-50 text-slate-950"><VendorSidebar /><main className="px-5 py-8 lg:ml-72 lg:px-10"><p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700">Vendor workspace</p><h1 className="mt-2 text-3xl font-black">{title}</h1><p className="mt-2 max-w-3xl text-slate-600">{description}</p><div className="mt-8">{children}</div></main></div>;

const State = ({ loading, error, empty, retry }) => {
  if (loading) return <div className="rounded-3xl bg-white p-10 text-slate-500">Loading live data…</div>;
  if (error) return <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800"><p className="font-bold">{error}</p><button type="button" onClick={retry} className="mt-4 rounded-xl bg-red-700 px-4 py-2 font-bold text-white">Try again</button></div>;
  if (empty) return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Nothing has been added yet.</div>;
  return null;
};

const useLiveData = (load) => {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ loading: true, error: "", data: null });
  useEffect(() => {
    let active = true;
    load().then((data) => { if (active) setState({ loading: false, error: "", data }); })
      .catch((error) => { if (active) setState({ loading: false, error: error.message || "Unable to load data.", data: null }); });
    return () => { active = false; };
  }, [load, version]);
  return { ...state, retry: () => { setState((current) => ({ ...current, loading: true, error: "" })); setVersion((value) => value + 1); } };
};

const loadSubscription = () => Promise.all([apiRequest("/subscriptions/plans", { auth: false }), apiRequest("/subscriptions/vendor/current")]).then(([plans, current]) => ({ plans: plans.plans || [], ...current }));
export const VendorSubscription = () => {
  const resource = useLiveData(loadSubscription);
  const subscribe = async (plan) => { try { await apiRequest("/subscriptions/vendor", { method: "POST", body: { planId: plan._id } }); resource.retry(); } catch (error) { window.alert(error.message); } };
  return <Layout title="Subscription" description="Choose an available plan. Paid billing is not activated until a verified provider is configured."><State {...resource} retry={resource.retry} />{resource.data && <><section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Current plan</h2><p className="mt-3 text-slate-600">{resource.data.subscription?.plan?.name || "No active subscription"}</p>{resource.data.subscription?.expiresAt && <p className="mt-1 text-sm text-slate-500">Renews or expires {new Date(resource.data.subscription.expiresAt).toLocaleDateString()}</p>}</section><section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{resource.data.plans.map((plan) => <article key={plan._id} className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-xl font-black">{plan.name}</h3><p className="mt-2 text-3xl font-black text-teal-800">{money.format(plan.price || 0)}</p><p className="mt-2 text-sm text-slate-500">per {plan.billingCycle || "month"}</p><ul className="my-5 space-y-2 text-sm text-slate-600">{(plan.features || []).map((feature) => <li key={feature}>• {feature}</li>)}</ul><button type="button" onClick={() => subscribe(plan)} disabled={plan.price > 0} className="rounded-xl bg-teal-800 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{plan.price > 0 ? "Billing unavailable" : "Activate plan"}</button></article>)}</section></>}</Layout>;
};

const loadSpotlight = () => apiRequest("/subscriptions/spotlight/vendor/current");
export const VendorSpotlight = () => {
  const resource = useLiveData(loadSpotlight);
  return <Layout title="Spotlight" description="Featured placement requires verified billing. EventSure will never show an unverified paid placement as active."><State {...resource} retry={resource.retry} />{resource.data && <section className="rounded-3xl bg-white p-8 shadow-sm"><h2 className="text-xl font-black">Placement status</h2>{resource.data.spotlight ? <div className="mt-4"><p className="font-bold capitalize">{resource.data.spotlight.status}</p><p className="mt-2 text-sm text-slate-500">Expires {new Date(resource.data.spotlight.expiresAt).toLocaleString()}</p></div> : <p className="mt-3 text-slate-600">No active spotlight placement.</p>}<button type="button" disabled className="mt-6 rounded-xl bg-slate-300 px-4 py-3 font-bold text-white">Billing setup required</button></section>}</Layout>;
};

const loadPortfolio = () => apiRequest("/vendors/profile/me");
export const VendorPortfolio = () => {
  const resource = useLiveData(loadPortfolio);
  const vendor = resource.data?.vendor;
  return <Layout title="Portfolio" description="Edit the services and media shown on your public vendor profile."><State {...resource} empty={!resource.loading && !resource.error && !vendor} retry={resource.retry} />{vendor && <><section className="rounded-3xl bg-white p-8 shadow-sm"><div className="flex flex-col gap-5 sm:flex-row sm:items-center">{vendor.logo && <img src={vendor.logo} alt="" className="size-24 rounded-2xl object-cover" />}<div><h2 className="text-2xl font-black">{vendor.businessName}</h2><p className="mt-1 text-slate-500">{vendor.category} · {vendor.location || "Location not set"}</p><p className="mt-4 max-w-3xl text-slate-700">{vendor.description || "Add a business description below."}</p></div></div></section><section className="mt-6 grid gap-5 md:grid-cols-2">{(vendor.services || []).map((service) => <article key={typeof service === "string" ? service : service._id || service.name} className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="font-black">{typeof service === "string" ? service : service.name || service.title}</h3>{typeof service !== "string" && <><p className="mt-2 text-sm text-slate-600">{service.description}</p>{service.price !== undefined && <p className="mt-4 font-black text-teal-800">{money.format(service.price)}</p>}</>}</article>)}</section>{vendor.gallery?.length > 0 && <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{vendor.gallery.map((image) => <img key={image} src={image} alt={`${vendor.businessName} portfolio`} className="h-64 w-full rounded-3xl object-cover" />)}</section>}<PortfolioEditor vendor={vendor} onSaved={resource.retry} /></>}</Layout>;
};

const PortfolioEditor = ({ vendor, onSaved }) => {
  const [form, setForm] = useState({
    description: vendor.description || "",
    tagline: vendor.tagline || "",
    services: (vendor.services || []).map((service) => typeof service === "string" ? service : service.name || service.title).filter(Boolean).join("\n"),
    gallery: (vendor.gallery || []).join("\n"),
    coverImage: vendor.coverImage || "",
    logo: vendor.logo || "",
  });
  const [status, setStatus] = useState({ saving: false, message: "", error: "" });
  const submit = async (event) => {
    event.preventDefault();
    setStatus({ saving: true, message: "", error: "" });
    try {
      await apiRequest("/vendors/profile/me", { method: "PATCH", body: {
        ...form,
        services: form.services.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 30),
        gallery: form.gallery.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 30),
      } });
      setStatus({ saving: false, message: "Portfolio saved.", error: "" });
      onSaved();
    } catch (error) {
      setStatus({ saving: false, message: "", error: error.message || "Unable to save portfolio." });
    }
  };
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  return <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl bg-white p-8 shadow-sm"><h2 className="text-xl font-black">Edit public portfolio</h2><label className="block text-sm font-bold">Tagline<input name="tagline" value={form.tagline} onChange={update} maxLength="160" className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label><label className="block text-sm font-bold">Description<textarea name="description" value={form.description} onChange={update} maxLength="3000" rows="5" className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label><label className="block text-sm font-bold">Services (one per line)<textarea name="services" value={form.services} onChange={update} rows="6" className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label><div className="grid gap-5 md:grid-cols-2"><label className="block text-sm font-bold">Logo URL<input type="url" name="logo" value={form.logo} onChange={update} className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label><label className="block text-sm font-bold">Cover image URL<input type="url" name="coverImage" value={form.coverImage} onChange={update} className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label></div><label className="block text-sm font-bold">Gallery image URLs (one per line)<textarea name="gallery" value={form.gallery} onChange={update} rows="6" className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label><button disabled={status.saving} className="rounded-xl bg-teal-800 px-5 py-3 font-bold text-white disabled:opacity-60">{status.saving ? "Saving…" : "Save portfolio"}</button>{status.message && <p className="font-bold text-teal-800">{status.message}</p>}{status.error && <p role="alert" className="font-bold text-red-700">{status.error}</p>}</form>;
};
