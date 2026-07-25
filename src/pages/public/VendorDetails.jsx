import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import apiRequest from "../../services/api.js";

const VendorDetails = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest(`/vendors/${vendorId}`, { auth: false }).then(({ vendor: item }) => setVendor(item)).catch((requestError) => setError(requestError.message)); }, [vendorId]);
  if (error) return <main className="flex min-h-screen items-center justify-center p-6"><p role="alert" className="text-red-700">{error}</p></main>;
  if (!vendor) return <main className="flex min-h-screen items-center justify-center" aria-live="polite">Loading vendor…</main>;
  return <main className="min-h-screen bg-slate-50 pb-16">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><Link to="/" className="text-2xl font-black text-teal-800">EventSure</Link><Link to="/login" className="rounded-xl bg-teal-800 px-5 py-3 font-bold text-white">Sign in to book</Link></div></header>
    <section className="mx-auto max-w-6xl px-6 py-10">
      <img src={vendor.coverImage || vendor.logo || "/image1.png"} alt={`${vendor.businessName} portfolio`} className="h-80 w-full rounded-3xl object-cover" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div><div className="flex items-center gap-3"><h1 className="text-4xl font-black">{vendor.businessName}</h1>{vendor.isVerified && <BadgeCheck className="text-teal-700" aria-label="Verified vendor" />}</div><p className="mt-3 flex items-center gap-2 text-slate-600"><MapPin size={18} />{vendor.location || "Location not provided"}</p><p className="mt-7 leading-8 text-slate-600">{vendor.description || "This vendor has not added a description yet."}</p><h2 className="mt-10 text-2xl font-black">Services</h2><div className="mt-4 flex flex-wrap gap-3">{(vendor.services || []).map((service) => <span key={service} className="rounded-full bg-white px-4 py-2 shadow-sm">{service}</span>)}</div></div>
        <aside className="h-fit rounded-3xl bg-white p-7 shadow-sm"><p className="flex items-center gap-2 font-bold"><Star size={18} className="text-amber-600" />{vendor.rating || "New"} {vendor.reviewCount ? `(${vendor.reviewCount})` : ""}</p><p className="mt-6 text-sm text-slate-500">Starting from</p><p className="mt-1 text-2xl font-black">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(vendor.startingPrice || 0)}</p><Link to="/login" className="mt-7 block rounded-xl bg-teal-800 px-5 py-4 text-center font-bold text-white">Sign in to contact vendor</Link></aside>
      </div>
    </section>
  </main>;
};

export default VendorDetails;
