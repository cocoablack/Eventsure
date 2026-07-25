import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  ClipboardList,
  BriefcaseBusiness,
  CheckCircle,
  BadgeDollarSign,
  Sun,
  Image,
  UserCircle,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const topLinks = [
  { name: "Dashboard", path: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "KYC", path: "/vendor/kyc", icon: ShieldCheck },
  { name: "Booking Requests", path: "/vendor/booking-requests", icon: ClipboardList },
  { name: "Active Jobs", path: "/vendor/active-jobs", icon: BriefcaseBusiness },
  { name: "Completed Jobs", path: "/vendor/completed-jobs", icon: CheckCircle },
];

const middleLinks = [
  { name: "Subscription", path: "/vendor/subscription", icon: BadgeDollarSign },
  { name: "Spotlight", path: "/vendor/spotlight", icon: Sun },
  { name: "Portfolio", path: "/vendor/portfolio", icon: Image },
  { name: "Profile", path: "/vendor/profile", icon: UserCircle },
  { name: "Messages", path: "/vendor/messages", icon: MessageSquare },
  { name: "Account Settings", path: "/vendor/settings", icon: Settings },
];

const VendorSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-slate-100 px-6 py-8 lg:flex lg:flex-col">
      <div>
        <h1 className="text-2xl font-bold text-teal-800">EventSure</h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Vendor Dashboard
        </p>
      </div>

      <nav className="mt-14 flex flex-col gap-3">
        {topLinks.map((item) => (
          <SidebarLink key={item.name} item={item} />
        ))}
      </nav>

      <nav className="mt-8 border-t border-slate-200 pt-8">
        <div className="flex flex-col gap-3">
          {middleLinks.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-5">
        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-4 rounded-xl px-4 py-4 font-medium text-slate-500 hover:bg-white hover:text-teal-800"><LogOut size={22} />Logout</button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition ${
          isActive
            ? "border-r-4 border-teal-800 bg-teal-50 text-teal-800"
            : "text-slate-500 hover:bg-white hover:text-teal-800"
        }`
      }
    >
      <Icon size={22} />
      <span>{item.name}</span>
    </NavLink>
  );
};

export default VendorSidebar;
