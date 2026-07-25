import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import apiRequest, { downloadCsv } from "../../services/api.js";

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const prettify = (value) => value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
const displayValue = (value, key = "") => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" && key === "amountKobo") return money.format(value / 100);
  if (typeof value === "number" && /amount|price|revenue|spent|earning|fee|value|budget/i.test(key)) return money.format(value);
  if (typeof value === "object") return JSON.stringify(value);
  if (/At$|Date$|date$/.test(key) && !Number.isNaN(Date.parse(value))) return new Date(value).toLocaleString();
  return String(value);
};

const Shell = ({ title, description, children, actions }) => (
  <div className="min-h-screen bg-slate-50 text-slate-950">
    <AdminSidebar />
    <main className="px-5 py-8 lg:ml-72 lg:px-10">
      <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700">EventSure operations</p>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          {description && <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </header>
      {children}
    </main>
  </div>
);

const State = ({ loading, error, empty, onRetry }) => {
  if (loading) return <div className="rounded-3xl bg-white p-10 text-slate-500 shadow-sm" aria-live="polite">Loading live data…</div>;
  if (error) return <div className="rounded-3xl border border-red-200 bg-red-50 p-8"><p className="font-bold text-red-800">{error}</p><button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-red-700 px-4 py-2 font-bold text-white">Try again</button></div>;
  if (empty) return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No records match this view.</div>;
  return null;
};

const useResource = (path) => {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const load = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    apiRequest(path).then((data) => setState({ loading: false, error: "", data }))
      .catch((error) => setState({ loading: false, error: error.message || "Unable to load live data.", data: null }));
  }, [path]);
  useEffect(() => {
    let active = true;
    apiRequest(path)
      .then((data) => { if (active) setState({ loading: false, error: "", data }); })
      .catch((error) => { if (active) setState({ loading: false, error: error.message || "Unable to load live data.", data: null }); });
    return () => { active = false; };
  }, [path]);
  return { ...state, load };
};

const SummaryGrid = ({ data }) => {
  const values = Object.entries(data || {}).filter(([, value]) => ["string", "number"].includes(typeof value)).slice(0, 12);
  if (!values.length) return null;
  return <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{values.map(([key, value]) => <article key={key} className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{prettify(key)}</p><p className="mt-3 text-2xl font-black text-teal-800">{displayValue(value, key)}</p></article>)}</section>;
};

export const AdminDashboard = () => {
  const resource = useResource("/admin/dashboard");
  const sections = useMemo(() => Object.entries(resource.data || {}).filter(([, value]) => value && typeof value === "object" && !Array.isArray(value)), [resource.data]);
  const collections = useMemo(() => Object.entries(resource.data || {}).filter(([, value]) => Array.isArray(value)), [resource.data]);
  return <Shell title="Dashboard" description="Live platform metrics; no sample activity is substituted if the API is unavailable.">
    <State {...resource} onRetry={resource.load} />
    {!resource.loading && !resource.error && <>{sections.map(([name, values]) => <div key={name}><h2 className="mb-4 text-lg font-black">{prettify(name)}</h2><SummaryGrid data={values} /></div>)}{collections.map(([name, records]) => <section key={name} className="mb-8"><h2 className="mb-4 text-lg font-black">{prettify(name)}</h2>{records.length ? <div className="grid gap-4">{records.map((record) => <article key={record._id} className="rounded-2xl bg-white p-5 shadow-sm"><p className="font-black">{record.title || record.reference || record._id}</p><p className="mt-2 text-sm capitalize text-slate-600">{record.status || record.vendor?.businessName || "Recent activity"}</p></article>)}</div> : <p className="rounded-2xl bg-white p-5 text-slate-500">No recent records.</p>}</section>)}</>}
  </Shell>;
};

const configs = {
  users: { title: "Users", key: "users", endpoint: "/admin/users", detail: "/admin/users", fields: ["fullName", "email", "isBlocked", "createdAt"] },
  vendors: { title: "Vendors", key: "vendors", endpoint: "/admin/vendors", detail: "/admin/vendors", fields: ["businessName", "category", "kycStatus", "isVerified"] },
  kyc: { title: "KYC reviews", key: "reviews", endpoint: "/admin/kyc-reviews", detail: "/admin/kyc-reviews", fields: ["businessName", "status", "submittedAt", "reviewedAt"] },
  bookings: { title: "Bookings", key: "bookings", endpoint: "/admin/bookings", detail: "/admin/bookings", fields: ["title", "status", "totalAmount", "createdAt"] },
  payments: { title: "Payments", key: "payments", endpoint: "/admin/payments", detail: "/admin/payments", fields: ["reference", "status", "amountKobo", "createdAt"] },
  spotlight: { title: "Spotlight placements", key: "spotlights", endpoint: "/admin/spotlight", fields: ["category", "status", "startsAt", "expiresAt"] },
  subscriptions: { title: "Subscriptions", key: "subscriptions", endpoint: "/admin/subscriptions", fields: ["status", "startsAt", "expiresAt", "paymentReference"] },
  changes: { title: "Change requests", key: "requests", endpoint: "/admin/change-requests", detail: "/admin/change-requests", fields: ["requestType", "status", "createdAt", "reviewedAt"] },
  deletions: { title: "Deletion requests", key: "requests", endpoint: "/admin/deletion-requests", detail: "/admin/deletion-requests", fields: ["reason", "status", "requestedAt", "scheduledDeletionDate"] },
  disputes: { title: "Disputes", key: "disputes", endpoint: "/admin/disputes", detail: "/admin/disputes", fields: ["subject", "status", "priority", "createdAt"] },
  policies: { title: "Policies", key: "policies", endpoint: "/admin/policies", detail: "/admin/policies", fields: ["title", "slug", "category", "isPublished"] },
  notifications: { title: "Notifications", key: "notifications", endpoint: "/admin/notifications", fields: ["title", "message", "isRead", "createdAt"] },
  audit: { title: "Audit log", key: "auditLogs", endpoint: "/admin/audit-logs", fields: ["action", "resourceType", "severity", "createdAt"], exportPath: "/admin/audit-logs/export" },
  staff: { title: "Admin staff", key: "staff", endpoint: "/admin/staff", fields: ["fullName", "email", "isBlocked", "lastLogin"] },
};

export const AdminListPage = ({ type }) => {
  const config = configs[type];
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const searchable = ["users", "vendors", "bookings"].includes(type);
  const resource = useResource(`${config.endpoint}?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`);
  const records = resource.data?.[config.key] || [];
  const pagination = resource.data?.pagination;
  const [operation, setOperation] = useState({ error: "", message: "" });
  const runOperation = async (path, method = "PATCH") => {
    setOperation({ error: "", message: "" });
    try {
      await apiRequest(path, { method });
      setOperation({ error: "", message: "Operation completed." });
      resource.load();
    } catch (error) {
      setOperation({ error: error.message || "Operation failed.", message: "" });
    }
  };
  const actions = <>{searchable && <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} className="flex"><input aria-label={`Search ${config.title}`} value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search records" className="w-44 rounded-l-xl border border-r-0 border-slate-300 bg-white px-3 py-2" /><button className="rounded-r-xl border border-slate-300 bg-slate-100 px-3 py-2 font-bold">Search</button></form>}<button type="button" onClick={resource.load} className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold"><RefreshCw size={16} /> Refresh</button>{type === "notifications" && <button type="button" onClick={() => runOperation("/admin/notifications/mark-all-read")} className="rounded-xl bg-teal-800 px-4 py-2 font-bold text-white">Mark all read</button>}{type === "audit" && <button type="button" onClick={() => runOperation("/admin/audit-logs/validate-integrity", "POST")} className="rounded-xl bg-teal-800 px-4 py-2 font-bold text-white">Validate chain</button>}{config.exportPath && <button type="button" onClick={() => downloadCsv(config.exportPath, `${type}.csv`)} className="flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2 font-bold text-white"><Download size={16} /> Export CSV</button>}</>;
  const hasRowAction = Boolean(config.detail) || type === "spotlight" || type === "notifications";
  return <Shell title={config.title} description="Records are fetched from the authenticated administration API." actions={actions}>
    <State {...resource} empty={!records.length} onRetry={resource.load} />
    {operation.error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 font-bold text-red-800">{operation.error}</p>}{operation.message && <p className="mb-4 rounded-xl bg-teal-50 p-4 font-bold text-teal-800">{operation.message}</p>}
    {!!records.length && <div className="overflow-x-auto rounded-3xl bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-100"><tr>{config.fields.map((field) => <th key={field} className="px-5 py-4 font-black">{prettify(field)}</th>)}{hasRowAction && <th className="px-5 py-4">Action</th>}</tr></thead><tbody>{records.map((record) => <tr key={record._id} className="border-b border-slate-100 last:border-0">{config.fields.map((field) => <td key={field} className="max-w-xs px-5 py-4 text-slate-700">{displayValue(record[field], field)}</td>)}{hasRowAction && <td className="px-5 py-4">{config.detail && <Link to={`${config.detail}/${record._id}${type === "policies" ? "/edit" : ""}`} className="font-black text-teal-800">View</Link>}{type === "spotlight" && record.status === "active" && <button type="button" onClick={() => runOperation(`/admin/spotlight/${record._id}/resolve`)} className="font-black text-red-700">Cancel</button>}{type === "notifications" && !record.isRead && <button type="button" onClick={() => runOperation(`/admin/notifications/${record._id}/read`)} className="font-black text-teal-800">Mark read</button>}</td>}</tr>)}</tbody></table></div>}
    {pagination && <nav aria-label={`${config.title} pagination`} className="mt-5 flex items-center justify-between rounded-2xl bg-white p-4"><p className="text-sm text-slate-600">Page {pagination.page} of {pagination.pages || 1} · {pagination.total} records</p><div className="flex gap-3"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40">Previous</button><button type="button" disabled={page >= (pagination.pages || 1)} onClick={() => setPage((value) => value + 1)} className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40">Next</button></div></nav>}
  </Shell>;
};

const detailConfigs = {
  user: { title: "User details", key: "user", endpoint: "/admin/users", actions: ["block", "unblock"] },
  vendor: { title: "Vendor details", key: "vendor", endpoint: "/admin/vendors", actions: ["verify", "block", "unblock"] },
  kyc: { title: "KYC review", key: "review", endpoint: "/admin/kyc-reviews", actions: ["approve", "reject"] },
  booking: { title: "Booking details", key: "booking", endpoint: "/admin/bookings", actions: ["cancel", "complete"] },
  payment: { title: "Payment details", key: "payment", endpoint: "/admin/payments", actions: [] },
  change: { title: "Change request", key: "request", endpoint: "/admin/change-requests", actions: ["approve", "reject"] },
  deletion: { title: "Deletion request", key: "request", endpoint: "/admin/deletion-requests", actions: ["approve", "reject"] },
  dispute: { title: "Dispute details", key: "dispute", endpoint: "/admin/disputes", actions: ["investigate", "resolve", "close", "reopen"] },
};

const ObjectView = ({ value }) => <dl className="grid gap-4 sm:grid-cols-2">{Object.entries(value || {}).filter(([key]) => !["password", "passwordHash", "documents"].includes(key)).map(([key, item]) => <div key={key} className="rounded-2xl border border-slate-200 p-5"><dt className="text-xs font-black uppercase tracking-wider text-slate-500">{prettify(key)}</dt><dd className="mt-2 break-words text-sm font-semibold text-slate-800">{displayValue(item, key)}</dd></div>)}</dl>;

const KycDocuments = ({ documents }) => {
  const entries = Object.entries(documents || {}).filter(([, document]) => document?.url);
  return <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Secure documents</h2><p className="mt-2 text-sm text-slate-600">These authenticated Cloudinary assets are returned only by the administrator-protected review endpoint.</p>{entries.length ? <div className="mt-5 flex flex-wrap gap-3">{entries.map(([name, document]) => <a key={name} href={document.url} target="_blank" rel="noreferrer" className="rounded-xl bg-teal-800 px-4 py-3 font-bold text-white">Open {prettify(name)}</a>)}</div> : <p className="mt-5 rounded-xl bg-amber-50 p-4 font-bold text-amber-900">No uploaded document URLs are attached to this submission.</p>}</section>;
};

export const AdminDetailPage = ({ type }) => {
  const params = useParams();
  const config = detailConfigs[type];
  const id = Object.values(params)[0];
  const resource = useResource(`${config.endpoint}/${id}`);
  const record = resource.data?.[config.key];
  const [actionError, setActionError] = useState("");
  const act = async (action) => {
    setActionError("");
    let body = {};
    if (type === "kyc" && action === "reject") {
      const rejectionReason = window.prompt("Enter the reason for rejecting this KYC submission:");
      if (!rejectionReason) return;
      body = { rejectionReason };
    }
    if (type === "deletion" && action === "reject") {
      const adminNote = window.prompt("Optional note explaining why this deletion request is rejected:") ?? null;
      if (adminNote === null) return;
      body = { adminNote };
    }
    try { await apiRequest(`${config.endpoint}/${id}/${action}`, { method: "PATCH", body }); resource.load(); }
    catch (error) { setActionError(error.message); }
  };
  return <Shell title={config.title} actions={record && config.actions.map((action) => <button key={action} type="button" onClick={() => act(action)} className="rounded-xl bg-teal-800 px-4 py-2 font-bold capitalize text-white">{action}</button>)}>
    <State {...resource} empty={!record} onRetry={resource.load} />
    {actionError && <p className="mb-4 rounded-xl bg-red-50 p-4 text-red-800">{actionError}</p>}
    {record && type === "kyc" && <KycDocuments documents={record.documents} />}
    {record && <section className="rounded-3xl bg-white p-6 shadow-sm"><ObjectView value={record} /></section>}
  </Shell>;
};

export const AdminReportsPage = () => {
  const resource = useResource("/admin/reports");
  return <Shell title="Reports and analytics" actions={<button type="button" onClick={() => downloadCsv("/admin/reports/export", "eventsure-report.csv")} className="rounded-xl bg-teal-800 px-4 py-2 font-bold text-white">Export CSV</button>}><State {...resource} onRetry={resource.load} />{resource.data?.reports && <ObjectView value={resource.data.reports} />}</Shell>;
};

const SettingsForm = ({ initial }) => {
  const [form, setForm] = useState({
    serviceFee: initial.financial?.serviceFee ?? 0,
    processingFee: initial.financial?.processingFee ?? 0,
    upfrontDeposit: initial.payout?.upfrontDeposit ?? 30,
    finalSettlement: initial.payout?.finalSettlement ?? 70,
  });
  const [message, setMessage] = useState("");
  const save = async (event) => { event.preventDefault(); setMessage(""); try { await apiRequest("/admin/settings/apply", { method: "PATCH", body: form }); setMessage("Settings saved."); } catch (error) { setMessage(error.message); } };
  return <form onSubmit={save} className="rounded-3xl bg-white p-6 shadow-sm"><div className="grid gap-5 sm:grid-cols-2">{Object.entries(form).map(([key, value]) => <label key={key} className="text-sm font-bold text-slate-700">{prettify(key)} (%)<input type="number" min="0" max="100" step="0.1" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 p-3" required /></label>)}</div><button className="mt-6 rounded-xl bg-teal-800 px-5 py-3 font-bold text-white">Save settings</button>{message && <p className="mt-4 text-sm font-bold">{message}</p>}</form>;
};

export const AdminSettingsPage = () => {
  const resource = useResource("/admin/settings");
  return <Shell title="Platform settings" description="Operational values are persisted server-side and changes are audit logged."><State {...resource} onRetry={resource.load} />{resource.data?.settings && <SettingsForm key={resource.data.settings._id || "settings"} initial={resource.data.settings} />}</Shell>;
};

const PolicyForm = ({ initial, policyId }) => {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const save = async (event) => { event.preventDefault(); setMessage(""); try { await apiRequest(`/policies/${policyId}`, { method: "PATCH", body: form }); setMessage("Policy saved."); } catch (error) { setMessage(error.message); } };
  return <form onSubmit={save} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm"><label className="block text-sm font-bold">Title<input value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 p-3" required /></label><label className="block text-sm font-bold">Content<textarea value={form.content || ""} onChange={(event) => setForm({ ...form, content: event.target.value })} rows="18" className="mt-2 w-full rounded-xl border border-slate-300 p-3" required /></label><label className="flex items-center gap-3 font-bold"><input type="checkbox" checked={Boolean(form.isPublished)} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} /> Published</label><button className="rounded-xl bg-teal-800 px-5 py-3 font-bold text-white">Save policy</button>{message && <p className="font-bold">{message}</p>}</form>;
};

export const AdminPolicyEditor = () => {
  const { policyId } = useParams();
  const resource = useResource(`/admin/policies/${policyId}`);
  return <Shell title="Policy editor"><State {...resource} onRetry={resource.load} />{resource.data?.policy && <PolicyForm key={resource.data.policy._id} initial={resource.data.policy} policyId={policyId} />}</Shell>;
};
