import { apiFetch } from "../../services/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  HelpCircle,
  CalendarDays,
  Shield,
  Pencil,
  Trash2,
  BarChart3,
  RotateCcw,
  History,
  Settings,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile({ ...data.user, accountType: "Event Planner", membership: "Standard account",
          memberSince: data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : "Not available",
          profileReach: 0, lastLogin: data.user.lastLogin ? new Date(data.user.lastLogin).toLocaleString() : "Not recorded",
          lastVerifiedDays: null, avatar: data.user.avatar || "/image1.png",
          latestEvent: { title: "No event activity to show yet", image: "/image1.png" },
        });
      } catch (error) {
        setProfile(emptyProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden w-full max-w-md items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search events or vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-4 text-slate-700 sm:gap-5">
            <Bell size={21} />
            <HelpCircle size={21} />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <span className="font-black text-teal-800">Account</span>
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="w-full max-w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
            Account <span className="mx-2">›</span>
            <span className="text-teal-800">Profile Information</span>
          </p>

          <h1 className="mt-4 break-words text-3xl font-black sm:text-4xl">
            Member Profile
          </h1>

          <div className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="relative w-fit shrink-0">
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="h-28 w-28 rounded-xl object-cover shadow-xl sm:h-36 sm:w-36"
                  />

                  <button className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-800 text-white shadow-lg">
                    <Settings size={18} />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h2 className="break-words text-2xl font-black sm:text-3xl">
                        {profile.fullName}
                      </h2>
                      <p className="mt-1 break-words text-base text-slate-500 sm:text-lg">
                        @{profile.username}
                      </p>

                      <p className="mt-5 flex flex-wrap items-center gap-2 font-bold text-teal-800">
                        <CalendarDays size={17} />
                        Member since {profile.memberSince}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-teal-800 px-5 py-2 text-xs font-black uppercase tracking-widest text-white">
                      {profile.membership}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-slate-100 pt-8">
                <div className="grid min-w-0 gap-8 md:grid-cols-2">
                  <ProfileInfo label="Email Address" value={profile.email} />
                  <ProfileInfo label="Phone Number" value={profile.phone} />
                  <ProfileInfo label="Location" value={profile.location} />
                  <ProfileInfo label="Account Type" value={profile.accountType} />
                </div>
              </div>
            </section>

            <aside className="min-w-0 space-y-6">
              <section className="min-w-0 rounded-2xl bg-slate-100 p-5 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-teal-800 sm:h-16 sm:w-16">
                    <Shield size={27} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="break-words text-xl font-black sm:text-2xl">
                      Data Integrity & Security
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      To maintain platform trust and improve the accuracy
                      of our premium marketplace, personal identity details
                      cannot be edited directly from this dashboard.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-white p-5 sm:mt-8 sm:p-6">
                  <p className="text-sm italic leading-7 text-slate-700 sm:text-base">
                    “All change requests undergo a 24-hour verification process
                    by our security team to protect your account from
                    unauthorized modifications.”
                  </p>
                </div>

                <div className="mt-6 space-y-4 sm:mt-8">
                  <Link
                    to="/user/profile/change-request"
                    className="flex items-center justify-center gap-3 rounded-xl bg-teal-800 px-5 py-4 text-sm font-black text-white shadow-lg hover:bg-teal-900 sm:text-base"
                  >
                    Request Detail Change <Pencil size={18} />
                  </Link>

                  <Link
                    to="/user/profile/delete-account"
                    className="flex items-center justify-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 text-sm font-black text-red-600 sm:text-base"
                  >
                    Request Account Deletion <Trash2 size={18} />
                  </Link>
                </div>
              </section>

              <section className="relative min-w-0 rounded-2xl bg-white p-5 pt-24 shadow-sm sm:p-6 sm:pt-6">
                <img
                  src={profile.latestEvent.image}
                  alt={profile.latestEvent.title}
                  className="absolute left-5 top-5 h-16 w-16 rounded-xl object-cover shadow-xl sm:-left-6 sm:-top-5 sm:h-24 sm:w-24"
                />

                <div className="sm:ml-16">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-800">
                    Latest Event
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                    {profile.latestEvent.title}
                  </p>
                </div>
              </section>
            </aside>
          </div>

          <div className="mt-10 grid min-w-0 gap-6 md:grid-cols-3">
            <MetricCard
              icon={<BarChart3 />}
              title="Profile Reach"
              text={`Your profile has been viewed by ${profile.profileReach} premium vendors this month.`}
            />
            <MetricCard
              icon={<RotateCcw />}
              title="Security Logs"
              text={`Last successful login: ${profile.lastLogin}.`}
            />
            <MetricCard
              icon={<History />}
              title="Change History"
              text={`Your email address was last verified ${profile.lastVerifiedDays} days ago.`}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const ProfileInfo = ({ label, value }) => {
  return (
    <div className="min-w-0">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 break-words text-base font-black leading-7 sm:text-lg">
        {value}
      </p>
    </div>
  );
};

const MetricCard = ({ icon, title, text }) => {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-100 p-5 sm:p-8">
      <div className="text-teal-800">{icon}</div>
      <h3 className="mt-6 break-words text-lg font-black sm:mt-8 sm:text-xl">
        {title}
      </h3>
      <p className="mt-3 break-words text-sm leading-7 text-slate-500 sm:mt-4 sm:text-base">
        {text}
      </p>
    </div>
  );
};

const emptyProfile = {
  fullName: "EventSure user", username: "", email: "", phone: "", location: "",
  accountType: "Event Planner", membership: "Standard account", memberSince: "Not available",
  profileReach: 0, lastLogin: "Not recorded", lastVerifiedDays: null, avatar: "/image1.png",
  latestEvent: { title: "No event activity to show yet", image: "/image1.png" },
};

export default UserProfile;
