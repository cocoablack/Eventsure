import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  CalendarCheck,
  HandCoins,
  WalletCards,
  MessageSquare,
  UserCircle,
  LogOut,
  Scale,
  Bell,
  Settings,
  X,
} from "lucide-react";

const userLinks = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Create Event", path: "/user/create-event", icon: PlusCircle },
  { name: "Browse Vendors", path: "/user/browse-vendors", icon: Search },
  { name: "My Bookings", path: "/user/bookings", icon: CalendarCheck },
  { name: "Offers", path: "/user/offers", icon: HandCoins },
  { name: "Payments", path: "/user/payments", icon: WalletCards },
  { name: "Messages", path: "/user/messages", icon: MessageSquare },
  { name: "Disputes", path: "/user/disputes", icon: Scale },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Completed Bookings", path: "/user/bookings/completed", icon: CalendarCheck },
];

const bottomLinks = [
  { name: "Profile", path: "/user/profile", icon: UserCircle },
  { name: "Account Settings", path: "/user/settings", icon: Settings },
];
import { useAuth } from "../../context/AuthContext.jsx";

const UserSidebar = ({ open = false, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col bg-slate-100 px-6 py-8 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:z-30`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-teal-800">EventSure</h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Premium Marketplace
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex-1 space-y-3 overflow-y-auto pr-1">
          {userLinks.map((item) => (
            <SidebarLink key={item.name} item={item} onClick={onClose} />
          ))}
        </nav>

        <nav className="mt-6 border-t border-slate-200 pt-6">
          <div className="space-y-3">
            {bottomLinks.map((item) => (
              <SidebarLink key={item.name} item={item} onClick={onClose} />
            ))}
            <button type="button" onClick={handleLogout} className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-base font-medium text-slate-500 hover:bg-white hover:text-teal-800"><LogOut size={22} />Logout</button>
          </div>
        </nav>
      </aside>
    </>
  );
};

const SidebarLink = ({ item, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition ${
          isActive
            ? "bg-white text-teal-800 shadow-sm"
            : "text-slate-500 hover:bg-white hover:text-teal-800"
        }`
      }
    >
      <Icon size={22} />
      <span>{item.name}</span>
    </NavLink>
  );
};

export default UserSidebar;
