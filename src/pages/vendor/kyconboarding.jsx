import { apiFetch } from "../../services/api.js";
import { useState } from "react";
import {
  Bell,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  Building2,
  IdCard,
  Image,
  UserCircle,
  Briefcase,
  Headphones,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import VendorSidebar from "../../components/vendor/VendorSidebar";

const KYCOnboarding = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    homeAddress: "",
    officeAddress: "",
    instagram: "",
    linkedin: "",
    governmentId: null,
    cacCertificate: null,
    faceOrLogo: null,
    pastPortfolio: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const requestData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) requestData.append(key, value);
      });

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/kyc`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: requestData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "KYC submission failed");
      }

      alert("KYC submitted successfully.");
    } catch (error) {
      alert(error.message || "Unable to submit KYC.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <VendorSidebar />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-8">
          <h1 className="text-xl font-black text-teal-900">
            Compliance Center
          </h1>

          <div className="flex items-center gap-5 text-slate-700">
            <Bell size={20} />
            <HelpCircle size={20} />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
              alt="Vendor"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 px-5 py-10 xl:grid-cols-[1fr_330px] lg:px-8"
        >
          <div>
            <ProgressBar />

            <section className="mt-12">
              <h2 className="text-3xl font-black">Identity Verification</h2>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Full Name Matching ID"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Johnathan Doe"
                  />

                  <Input
                    label="Contact Email"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="you@business.com"
                  />

                  <Input
                    label="Contact Phone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                  />

                  <Input
                    label="Website URL Optional"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div className="mt-6">
                  <Textarea
                    label="Home Address"
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleChange}
                    placeholder="123 Serenity Way, Victoria Island, Lagos"
                  />
                </div>

                <div className="mt-6">
                  <Textarea
                    label="Office Address"
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleChange}
                    placeholder="Professional Workspace Center, Suite 4B"
                  />
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-black">Required Documentation</h2>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <UploadBox
                  icon={<IdCard />}
                  title="Government Issued ID"
                  text="Upload a clear photo of your National Passport or Driver's License."
                  badge="Compulsory"
                  name="governmentId"
                  onChange={handleChange}
                  file={formData.governmentId}
                />

                <UploadBox
                  icon={<Building2 />}
                  title="CAC Certificate"
                  text="Official business registration document issued by the CAC."
                  badge="Compulsory"
                  name="cacCertificate"
                  onChange={handleChange}
                  file={formData.cacCertificate}
                />

                <UploadBox
                  icon={<UserCircle />}
                  title="Face Photo / Business Logo"
                  text="High-quality image for profile verification and branding."
                  badge="Compulsory"
                  name="faceOrLogo"
                  onChange={handleChange}
                  file={formData.faceOrLogo}
                />

                <UploadBox
                  icon={<Image />}
                  title="Past Event Portfolio"
                  text="Upload pictures or video reels of your previous professional events."
                  badge="Optional"
                  name="pastPortfolio"
                  onChange={handleChange}
                  file={formData.pastPortfolio}
                  optional
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-black">Social Networks</h2>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    icon={<FaInstagram size={20} />}
                    label="Instagram Profile"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                  />

                  <Input
                    icon={<Briefcase size={20} />}
                    label="LinkedIn Page"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/you"
                  />
                </div>
              </div>
            </section>

            <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="font-black text-slate-700"
                onClick={() => window.history.back()}
              >
                Back to Business Details
              </button>

              <button
                disabled={loading}
                className="rounded-xl bg-teal-800 px-10 py-4 font-black text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Review and Submit"}
              </button>
            </div>
          </div>

          <aside className="space-y-8">
            <section className="rounded-2xl bg-teal-900 p-8 text-white shadow-xl">
              <ShieldCheck size={32} />

              <h2 className="mt-8 text-2xl font-black">Security Notice</h2>

              <p className="mt-5 leading-7 text-teal-50/80">
                To maintain marketplace integrity, once your KYC details are
                submitted and verified, they cannot be edited directly. Changes
                require a formal support request.
              </p>

              <p className="mt-8 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-teal-100">
                <BadgeCheck size={16} />
                Encrypted & Secure
              </p>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="h-44 rounded-xl bg-gradient-to-br from-teal-100 to-slate-300" />

              <h3 className="mt-6 font-black text-teal-900">
                Verification Tips
              </h3>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-500">
                <li>Ensure all documents are clearly legible.</li>
                <li>Photos should be taken in bright, natural light.</li>
                <li>Use high-resolution scans for CAC certificates.</li>
                <li>Link active social profiles to speed up review.</li>
              </ul>

              <button className="mt-6 flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-3 text-sm font-black text-white">
                <Headphones size={17} />
                Chat with Support
              </button>
            </section>

            <section className="rounded-2xl bg-slate-100 p-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Marketplace Trust
                </p>
                <p className="font-black text-teal-800">98.4%</p>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white">
                <div className="h-2 w-[98%] rounded-full bg-teal-800" />
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                98.4% of EventSure vendors complete verification in under 48
                hours.
              </p>
            </section>
          </aside>
        </form>
      </main>
    </div>
  );
};

const ProgressBar = () => {
  const steps = [
    { label: "Personal Info", done: true },
    { label: "Business Details", done: true },
    { label: "Documentation", active: true },
    { label: "Socials", disabled: true },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-black ${
              step.done
                ? "border-teal-800 bg-teal-800 text-white"
                : step.active
                ? "border-teal-800 bg-white text-teal-800"
                : "border-slate-200 bg-slate-100 text-slate-300"
            }`}
          >
            {step.done ? "✓" : String(index + 1).padStart(2, "0")}
          </div>

          <p
            className={`text-xs font-black uppercase tracking-[0.25em] ${
              step.disabled ? "text-slate-300" : "text-teal-900"
            }`}
          >
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
};

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <div className="mt-3 flex items-center gap-3 bg-slate-100 px-5 py-4">
      {icon && <span className="text-teal-800">{icon}</span>}
      <input
        {...props}
        className="w-full bg-transparent outline-none placeholder:text-slate-400"
      />
    </div>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="mt-3 w-full resize-none bg-slate-100 px-5 py-4 outline-none placeholder:text-slate-400"
    />
  </div>
);

const UploadBox = ({ icon, title, text, badge, name, onChange, file, optional }) => (
  <label
    className={`flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition hover:border-teal-500 ${
      optional ? "bg-white" : "bg-slate-50"
    }`}
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-800 shadow-sm">
      {icon}
    </div>

    <h3 className="mt-5 font-black">{title}</h3>

    <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500">{text}</p>

    <span
      className={`mt-5 rounded px-3 py-1 text-xs font-black uppercase tracking-widest ${
        optional ? "bg-slate-200 text-slate-700" : "bg-teal-100 text-teal-800"
      }`}
    >
      {badge}
    </span>

    {file && <p className="mt-3 text-xs font-bold text-teal-800">{file.name}</p>}

    <input
      type="file"
      name={name}
      onChange={onChange}
      accept=".pdf,image/png,image/jpeg,video/mp4"
      className="hidden"
    />
  </label>
);

export default KYCOnboarding;
