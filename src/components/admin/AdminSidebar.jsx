import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  Sparkles,
  BadgeDollarSign,
  FilePenLine,
  Scale,
  Shield,
  Settings,
  LogOut,
  LifeBuoy,
  Trash2,
  UserCog,
  BarChart3,
  Bell,
  ScrollText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Vendors",
    icon: Store,
    path: "/admin/vendors",
  },
  {
    label: "KYC Reviews",
    icon: ShieldCheck,
    path: "/admin/kyc-reviews",
  },
  {
    label: "Bookings",
    icon: CalendarDays,
    path: "/admin/bookings",
  },
  {
    label: "Payments",
    icon: CreditCard,
    path: "/admin/payments",
  },
  {
    label: "Spotlight Management",
    icon: Sparkles,
    path: "/admin/spotlight",
  },
  {
    label: "Subscriptions",
    icon: BadgeDollarSign,
    path: "/admin/subscriptions",
  },
  {
    label: "Change Requests",
    icon: FilePenLine,
    path: "/admin/change-requests",
  },
  {
    label: "Deletion Requests",
    icon: Trash2,
    path: "/admin/deletion-requests",
  },
  {
    label: "Disputes",
    icon: Scale,
    path: "/admin/disputes",
  },
  {
    label: "Policies",
    icon: Shield,
    path: "/admin/policies",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    label: "Staff & Roles",
    icon: UserCog,
    path: "/admin/staff",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/admin/reports",
  },
  {
    label: "Audit Logs",
    icon: ScrollText,
    path: "/admin/audit-log",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
];

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Logo */}
      <div className="px-7 py-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg">
            <LayoutDashboard size={22} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-teal-800">
              EventSure
            </h2>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-4">
        <Link to="/contact" className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100">
          <LifeBuoy size={18} />
          <span>Support</span>
        </Link>

        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
