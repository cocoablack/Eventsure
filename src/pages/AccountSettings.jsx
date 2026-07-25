import { Link } from "react-router-dom";
import UserSidebar from "../components/users/UserSidebar.jsx";
import VendorSidebar from "../components/vendor/VendorSidebar.jsx";

const Settings = ({ role }) => {
  const vendor = role === "vendor";
  const base = vendor ? "/vendor" : "/user";
  const Sidebar = vendor ? VendorSidebar : UserSidebar;
  return <div className="min-h-screen bg-slate-50 text-slate-950"><Sidebar /><main className="px-5 py-10 lg:ml-72 lg:px-10"><p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700">{vendor ? "Vendor" : "Planner"} workspace</p><h1 className="mt-2 text-3xl font-black">Account settings</h1><p className="mt-2 text-slate-600">Manage profile corrections and account lifecycle requests.</p><div className="mt-8 grid gap-5 md:grid-cols-2"><SettingCard title="Profile" text="Review the public and contact information associated with this account." to={`${base}/profile`} action="Open profile" /><SettingCard title="Request a detail change" text="Submit a reviewed request for identity or protected account details." to={`${base}/profile/change-request`} action="Create request" /><SettingCard title="Account deletion" text="Request account deletion. Administrators review pending requests before the scheduled date." to={`${base}/profile/delete-account`} action="Manage deletion request" /><section className="rounded-3xl border border-amber-200 bg-amber-50 p-7"><h2 className="text-xl font-black">Password and email security</h2><p className="mt-3 text-sm leading-6 text-amber-900">Self-service password reset and email verification require a transactional email provider and are not enabled yet. Contact support if access must be recovered.</p><Link to="/contact" className="mt-5 inline-block font-black text-teal-800">Contact support</Link></section></div></main></div>;
};

const SettingCard = ({ title, text, to, action }) => <section className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p><Link to={to} className="mt-5 inline-block rounded-xl bg-teal-800 px-4 py-3 font-black text-white">{action}</Link></section>;

export const UserAccountSettings = () => <Settings role="user" />;
export const VendorAccountSettings = () => <Settings role="vendor" />;
