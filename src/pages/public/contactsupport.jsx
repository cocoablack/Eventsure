import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Headphones,
  MessageSquare,
  Send,
  Plus,
  Minus,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import apiRequest from "../../services/api.js";

const ContactSupport = () => {
  const [openFaq, setOpenFaq] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userType: "Event Planner",
    subject: "Account Verification",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await apiRequest("/support/contact", { method: "POST", body: formData, auth: false });
      setFeedback({ type: "success", message: "Your message has been submitted successfully." });

      setFormData({
        fullName: "",
        email: "",
        userType: "Event Planner",
        subject: "Account Verification",
        message: "",
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Failed to submit message." });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How do I get verified as a premium vendor?",
      answer:
        "Vendors must submit their full name, address, government ID, CAC certificate, social links, and business image or face photo. The admin team reviews the details before approval.",
    },
    {
      question: "How does the 30/70 payment model work?",
      answer:
        "EventSure releases 30% to the vendor after a confirmed booking so work can begin. The remaining 70% is released after the user confirms the job is completed.",
    },
    {
      question: "What kind of event services can I request?",
      answer:
        "Users can request catering, decoration, hall booking, drinks, food preparation, souvenirs, chairs, tables, rentals, and other event-related services.",
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Navbar */}
      <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-teal-800"
          >
            EventSure
          </Link>

          <div className="hidden items-center gap-8 text-[15px] font-medium text-slate-600 md:flex">
            <Link to="/" className="text-teal-800">
              Home
            </Link>
            <Link to="/how-it-works" className="hover:text-teal-800">
              How It Works
            </Link>
            <Link to="/find-vendors" className="hover:text-teal-800">
              Find Vendors
            </Link>
            <Link to="/register" className="hover:text-teal-800">
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
            onClick={() => setMenuOpen((prev) => !prev)}
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
                className="text-teal-800"
              >
                Home
              </Link>

              <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>
                How It Works
              </Link>

              <Link to="/find-vendors" onClick={() => setMenuOpen(false)}>
                Find Vendors
              </Link>

              <Link to="/register" onClick={() => setMenuOpen(false)}>
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/80 to-slate-50" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center lg:px-8 lg:py-28">
          <span className="rounded-full bg-teal-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-900">
            Support Center
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
            Your Vision, Supported by{" "}
            <span className="italic text-teal-800">Expertise.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Whether you are planning an event or managing vendor services, our
            support team is here to make your EventSure experience seamless.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="mx-auto -mt-10 grid max-w-7xl gap-6 px-5 lg:grid-cols-3 lg:px-8">
        <ContactCard
          icon={<Mail size={20} />}
          title="General Inquiries"
          text="Questions about our platform, partnerships, or account support."
          action="hello@eventsure.com"
        />

        <ContactCard
          icon={<Headphones size={20} />}
          title="Vendor Concierge"
          text="Priority line for verified vendors and vendor partnership support."
          action="+1 (888) EVENT-PRO"
        />

        <ContactCard
          icon={<MessageSquare size={20} />}
          title="Live Concierge"
          badge="Online"
          text="Real-time assistance for immediate platform navigation or technical needs."
          action="Start Chat →"
        />
      </section>

      {/* Form + Philosophy */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-3xl font-bold">Send a Message</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {feedback.message && <p role={feedback.type === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-semibold ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}>{feedback.message}</p>}
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Julianne Smith"
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="julianne@example.com"
              />

              <Select
                label="I Am A..."
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                options={["Event Planner", "Vendor", "Admin", "Guest"]}
              />

              <Select
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                options={[
                  "Account Verification",
                  "Booking Issue",
                  "Payment Issue",
                  "Vendor Support",
                  "General Inquiry",
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="How can our team assist you today?"
                className="mt-2 w-full resize-none border-0 border-b border-slate-300 bg-slate-100 px-4 py-4 text-sm outline-none transition focus:border-teal-700"
              />
            </div>

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-6 py-4 font-bold text-white shadow-lg shadow-teal-900/20 hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Inquiry"}
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="flex items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-800">
              Our Philosophy
            </p>

            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
              A platform built on{" "}
              <span className="italic text-teal-800">trust</span> and meticulous{" "}
              <span className="italic text-teal-800">service.</span>
            </h2>

            <div className="relative mt-10 max-w-md">
              <div className="absolute -left-6 -top-6 h-28 w-28 rounded-xl bg-teal-200" />

              <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl shadow-slate-300">
                <div className="h-64 bg-gradient-to-br from-teal-100 to-slate-200" />

                <div className="p-6">
                  <h3 className="font-semibold">Elena Vance</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                    Head of Concierge Relations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black">Frequently Asked</h2>
          <p className="mt-3 text-sm text-slate-600">
            Find quick answers to common questions about our marketplace
            mechanics.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-5">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="rounded-xl bg-white shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold"
              >
                {faq.question}
                {openFaq === index ? <Minus size={18} /> : <Plus size={18} />}
              </button>

              {openFaq === index && (
                <p className="px-6 pb-6 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/terms-and-conditions"
            className="flex items-center gap-2 text-sm font-semibold text-teal-800"
          >
            View Knowledge Base <ExternalLink size={15} />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-50 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-black text-teal-800">EventSure</h3>
            <p className="mt-3 max-w-md text-sm text-slate-500">
              Premium marketplace for secure event vendor discovery and booking.
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
    </div>
  );
};

const ContactCard = ({ icon, title, text, action, badge }) => {
  return (
    <div className="rounded-xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-teal-900">
        {icon}
      </div>

      <div className="mt-7 flex items-center gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge && (
          <span className="rounded-full bg-teal-100 px-2 py-1 text-[10px] font-bold uppercase text-teal-800">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{text}</p>
      <p className="mt-5 text-sm font-bold text-teal-900">{action}</p>
    </div>
  );
};

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <input
        required
        {...props}
        className="mt-2 w-full border-0 border-b border-slate-300 bg-slate-100 px-4 py-4 text-sm outline-none transition focus:border-teal-700"
      />
    </div>
  );
};

const Select = ({ label, options, ...props }) => {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <select
        {...props}
        className="mt-2 w-full border-0 border-b border-slate-300 bg-slate-100 px-4 py-4 text-sm outline-none transition focus:border-teal-700"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-teal-800">
        {title}
      </h4>

      <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
        {links.map(([label, path]) => (
          <Link key={label} to={path} className="hover:text-teal-800">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactSupport;
