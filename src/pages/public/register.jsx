import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Menu,
  ShieldCheck,
  Store,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { roleHome } from "../../components/auth/ProtectedRoute.jsx";

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  businessName: "",
  category: "",
  location: "",
};

function RegisterPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("user");
  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const changeRole = (nextRole) => {
    setRole(nextRole);
    setError("");
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Full name is required";
    }

    if (!form.username.trim()) {
      return "Username is required";
    }

    if (form.username.trim().length < 3) {
      return "Username must contain at least 3 characters";
    }

    if (!form.email.trim()) {
      return "Email address is required";
    }

    if (!form.password) {
      return "Password is required";
    }

    if (form.password.length < 8) {
      return "Password must contain at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    if (role === "vendor" && !form.businessName.trim()) {
      return "Business name is required for vendor accounts";
    }

    if (role === "vendor" && !form.category.trim()) {
      return "Service category is required for vendor accounts";
    }

    if (role === "vendor" && !form.location.trim()) {
      return "Business location is required for vendor accounts";
    }

    if (!agreed) {
      return "You must accept the terms and privacy policy";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      username: form.username.trim().toLowerCase(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
      role,
    };

    if (role === "vendor") {
      payload.businessName = form.businessName.trim();
      payload.category = form.category.trim();
      payload.location = form.location.trim();
    }

    setSubmitting(true);

    try {
      const user = await register(payload);

      navigate(roleHome(user.role), {
        replace: true,
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to create account");
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

            <Link to="/how-it-works" className="hover:text-teal-800">
              How It Works
            </Link>

            <Link to="/find-vendors" className="hover:text-teal-800">
              Find Vendors
            </Link>

            <button
              type="button"
              onClick={() => changeRole("vendor")}
              className="hover:text-teal-800"
            >
              Become a Vendor
            </button>
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
              <Link to="/" onClick={() => setMenuOpen(false)}>
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

              <button
                type="button"
                onClick={() => {
                  changeRole("vendor");
                  setMenuOpen(false);
                }}
                className="text-left"
              >
                Become a Vendor
              </button>

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

      <main className="min-h-screen bg-[#f0f2f5] px-4 pt-28 sm:px-6 lg:px-10">
        <section className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-black text-slate-950 sm:text-4xl lg:text-5xl">
            Join the Elite Network.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Begin your journey with EventSure. Whether planning an exquisite
            gala or offering premium services, excellence starts here.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
          <label
            className={`cursor-pointer rounded-2xl border-2 bg-white p-6 transition hover:shadow-xl ${
              role === "user"
                ? "border-teal-800 shadow-lg"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <CalendarDays className="text-teal-800" size={30} />

              <input
                type="radio"
                name="registerType"
                value="user"
                checked={role === "user"}
                onChange={() => changeRole("user")}
                className="size-5 accent-teal-800"
              />
            </div>

            <div className="pt-5">
              <h2 className="text-xl font-black sm:text-2xl">
                I'm Planning an Event
              </h2>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                Discover curated vendors and manage your dream event with
                precision.
              </p>
            </div>
          </label>

          <label
            className={`cursor-pointer rounded-2xl border-2 bg-white p-6 transition hover:shadow-xl ${
              role === "vendor"
                ? "border-teal-800 shadow-lg"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <Store className="text-teal-800" size={30} />

              <input
                type="radio"
                name="registerType"
                value="vendor"
                checked={role === "vendor"}
                onChange={() => changeRole("vendor")}
                className="size-5 accent-teal-800"
              />
            </div>

            <div className="pt-5">
              <h2 className="text-xl font-black sm:text-2xl">
                I'm Offering Services
              </h2>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                Grow your business by connecting with premium clients
                worldwide.
              </p>

              <div className="mt-4 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <ShieldCheck className="text-teal-800" size={18} />

                <p className="text-xs font-black uppercase tracking-widest">
                  KYC Required
                </p>
              </div>
            </div>
          </label>
        </section>

        <section className="mx-auto mt-10 max-w-5xl pb-20">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-5 shadow-xl sm:p-8 lg:p-12"
          >
            {error && (
              <p
                role="alert"
                className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </p>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Full Name"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={update}
                autoComplete="name"
                placeholder="Alexander Sterling"
              />

              <FormInput
                label="Username"
                id="username"
                name="username"
                value={form.username}
                onChange={update}
                autoComplete="username"
                placeholder="asterlingevents"
              />

              <FormInput
                label="Email Address"
                id="email"
                name="email"
                value={form.email}
                onChange={update}
                type="email"
                autoComplete="email"
                placeholder="alexander@gmail.com"
              />

              <FormInput
                label="Phone Number"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={update}
                type="tel"
                autoComplete="tel"
                required={false}
                placeholder="+234 805 555 5555"
              />

              <FormInput
                label="Password"
                id="password"
                name="password"
                value={form.password}
                onChange={update}
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="••••••••••"
              />

              <FormInput
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={update}
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="••••••••••"
              />

              {role === "vendor" && (
                <>
                  <FormInput
                    label="Business Name"
                    id="businessName"
                    name="businessName"
                    value={form.businessName}
                    onChange={update}
                    placeholder="Your registered or trading name"
                  />

                  <FormInput
                    label="Primary Service Category"
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={update}
                    placeholder="e.g. Catering"
                  />

                  <FormInput
                    label="Business Location"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={update}
                    placeholder="e.g. Lagos, Nigeria"
                  />
                </>
              )}
            </div>

            <div className="mt-8 flex items-start gap-3">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 size-5 shrink-0 accent-teal-800"
              />

              <label
                htmlFor="agree"
                className="text-sm font-medium leading-6 text-slate-600"
              >
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="font-black text-teal-800"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="font-black text-teal-800"
                >
                  Privacy Policy
                </Link>
                . I understand that identity verification is mandatory for
                vendor accounts.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-10 w-full rounded-2xl bg-teal-800 px-5 py-4 text-base font-black text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
              {submitting ? "Creating account…" : "Create Account"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-black text-teal-800">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </section>
      </main>

      <footer className="bg-slate-50 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-black text-teal-800">EventSure</h3>

            <p className="mt-3 max-w-md text-sm text-slate-500">
              Premium marketplace for secure event vendor discovery and
              booking.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:gap-6">
            <Link to="/terms-and-conditions">Terms and Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/contact">Contact Support</Link>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          © 2026 EventSure. Secure vendor marketplace.
        </p>
      </footer>
    </>
  );
}

const FormInput = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  autoComplete,
  required = true,
  minLength,
}) => (
  <div>
    <label
      htmlFor={id}
      className="text-xs font-black uppercase tracking-widest text-slate-700"
    >
      {label}
    </label>

    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      minLength={minLength}
      autoComplete={autoComplete}
      placeholder={placeholder}
      disabled={false}
      className="mt-2 h-12 w-full rounded-xl border-b-2 border-slate-400 bg-slate-100 px-5 text-sm outline-0 placeholder:font-medium focus:border-teal-800"
    />
  </div>
);

export default RegisterPage;