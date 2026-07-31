import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Menu,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { roleHome } from "../../components/auth/ProtectedRoute.jsx";

function LoginPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const identifier = form.identifier.trim();

    if (!identifier) {
      setError("Email or username is required");
      return;
    }

    if (!form.password) {
      setError("Password is required");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        identifier,
        password: form.password,
      };

      const user = await login(payload);

      const requestedPath = location.state?.from?.pathname;

      const destination =
        requestedPath?.startsWith(`/${user.role}/`)
          ? requestedPath
          : roleHome(user.role);

      navigate(destination, {
        replace: true,
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-teal-800"
          >
            EventSure
          </Link>

          <div className="hidden items-center gap-8 text-[15px] font-medium text-slate-600 md:flex">
            <Link to="/" className="hover:text-teal-800">
              Home
            </Link>

            <Link
              to="/how-it-works"
              className="hover:text-teal-800"
            >
              How It Works
            </Link>

            <Link
              to="/find-vendors"
              className="hover:text-teal-800"
            >
              Find Vendors
            </Link>

            <Link
              to="/register"
              className="hover:text-teal-800"
            >
              Become a Vendor
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-teal-800"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-teal-800 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-900/10 hover:bg-teal-900"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-5 shadow-xl md:hidden">
            <div className="flex flex-col gap-4 text-sm font-semibold text-slate-700">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setMenuOpen(false)}
              >
                How It Works
              </Link>

              <Link
                to="/find-vendors"
                onClick={() => setMenuOpen(false)}
              >
                Find Vendors
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Become a Vendor
              </Link>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-3 text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-teal-800 px-5 py-3 text-center text-white"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="min-h-screen bg-[#f0f2f5] px-4 pb-10 pt-28 sm:px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="login-image relative hidden min-h-[620px] bg-cover bg-center lg:block">
            <div className="absolute inset-0 bg-teal-900/30" />

            <div className="absolute bottom-12 left-10 right-10 z-10">
              <h1 className="max-w-xl text-4xl font-black leading-tight text-white">
                Curating Excellence for Every Celebration.
              </h1>

              <p className="mt-4 max-w-lg text-lg leading-8 text-white/90">
                Your gateway to a curated marketplace of premium event
                professionals and visionary planners.
              </p>
            </div>
          </div>

          <div className="px-5 py-10 sm:px-10 md:px-16 lg:py-16">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-800">
              Welcome Back
            </p>

            <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
              Access your dashboard
            </h1>

            <form
              onSubmit={handleSubmit}
              className="mt-10 w-full max-w-lg"
            >
              {error && (
                <p
                  role="alert"
                  className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                >
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="identifier"
                  className="text-sm font-black text-slate-700"
                >
                  Email or Username
                </label>

                <div className="mt-2 flex h-13 items-center rounded-xl bg-slate-100 px-4">
                  <User
                    size={22}
                    className="mr-3 shrink-0 text-teal-800"
                  />

                  <input
                    type="text"
                    name="identifier"
                    id="identifier"
                    value={form.identifier}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    disabled={submitting}
                    placeholder="Enter your email or username"
                    className="w-full bg-transparent text-sm outline-0 placeholder:font-medium disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-black text-slate-700"
                  >
                    Password
                  </label>

                  <span
                    className="text-sm text-slate-500"
                    title="Password reset is not enabled yet"
                  >
                    Password help: contact support
                  </span>
                </div>

                <div className="mt-2 flex h-13 items-center rounded-xl bg-slate-100 px-4">
                  <Lock
                    size={22}
                    className="mr-3 shrink-0 text-teal-800"
                  />

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    disabled={submitting}
                    placeholder="•••••••••••"
                    className="w-full bg-transparent text-sm outline-0 placeholder:font-medium disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-4 text-base font-black text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Login"}

                {!submitting && <ArrowRight size={22} />}
              </button>

              <div className="my-6 h-px w-full bg-slate-200" />

              <div className="rounded-2xl bg-slate-100 px-5 py-4">
                <p className="text-center text-sm italic leading-6 text-slate-600">
                  Planning an event? Or providing a service? Our system
                  automatically directs you to your specialized dashboard.
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm font-bold text-slate-700">
                  New to EventSure?{" "}
                  <Link
                    to="/register"
                    className="font-black text-teal-800 hover:underline"
                  >
                    Register Now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-black text-teal-800">
              EventSure
            </h3>

            <p className="mt-3 max-w-md text-sm text-slate-500">
              Premium marketplace for secure event vendor discovery and
              booking.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:gap-6">
            <Link to="/terms-and-conditions">
              Terms and Conditions
            </Link>

            <Link to="/privacy-policy">
              Privacy Policy
            </Link>

            <Link to="/contact">
              Contact Support
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          © 2026 EventSure. Secure vendor marketplace.
        </p>
      </footer>
    </>
  );
}

export default LoginPage;