import { useEffect, useState } from "react";
import UserSidebar from "../../components/users/UserSidebar.jsx";
import apiRequest from "../../services/api.js";

const Disputes = () => {
  const [state, setState] = useState({ loading: true, error: "", disputes: [] });
  useEffect(() => {
    apiRequest("/disputes").then((data) => setState({ loading: false, error: "", disputes: data.disputes || [] }))
      .catch((error) => setState({ loading: false, error: error.message, disputes: [] }));
  }, []);
  return <div className="min-h-screen bg-slate-50"><UserSidebar /><main className="px-5 py-8 lg:ml-72 lg:px-10"><p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700">Resolution centre</p><h1 className="mt-2 text-3xl font-black">My disputes</h1><p className="mt-2 text-slate-600">Open a dispute from its booking detail page and track the review here.</p><div className="mt-8">{state.loading ? <p className="rounded-3xl bg-white p-8 text-slate-500">Loading disputes…</p> : state.error ? <p role="alert" className="rounded-3xl bg-red-50 p-8 text-red-800">{state.error}</p> : state.disputes.length ? <div className="space-y-4">{state.disputes.map((dispute) => <article key={dispute._id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-slate-500">{dispute.reference}</p><h2 className="mt-2 text-xl font-black">{dispute.reason}</h2><p className="mt-2 text-sm text-slate-600">{dispute.booking?.title}</p></div><span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase text-teal-800">{dispute.status}</span></div>{dispute.resolution && <p className="mt-5 border-t border-slate-100 pt-5 text-sm text-slate-700"><strong>Resolution:</strong> {dispute.resolution}</p>}</article>)}</div> : <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">You have no disputes.</p>}</div></main></div>;
};

export default Disputes;
