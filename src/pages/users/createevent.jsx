import { apiFetch } from "../../services/api.js";
import { useMemo, useState } from "react";
import {
  Search,
  Mail,
  Bell,
  Info,
  MapPin,
  WalletCards,
  Utensils,
  Palette,
  Building2,
  Wine,
  Gift,
  Sofa,
  Sparkles,
  UploadCloud,
  Lightbulb,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";

const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    eventType: "Corporate Gala",
    eventDate: "",
    location: "",
    guestCount: "",
    budgetRange: "",
    requirements: "",
    inspirationImages: [],
  });

  const services = [
    { name: "Catering", icon: Utensils },
    { name: "Decoration", icon: Palette },
    { name: "Hall Booking", icon: Building2 },
    { name: "Drinks", icon: Wine },
    { name: "Souvenirs", icon: Gift },
    { name: "Rentals", icon: Sofa },
  ];

  const progress = useMemo(() => {
    let score = 0;

    if (
      formData.title &&
      formData.eventType &&
      formData.eventDate &&
      formData.location
    )
      score += 25;

    if (formData.guestCount && formData.budgetRange) score += 25;
    if (selectedServices.length > 0) score += 25;
    if (formData.requirements || formData.inspirationImages.length > 0)
      score += 25;

    return score;
  }, [formData, selectedServices]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "inspirationImages") {
      setFormData((prev) => ({
        ...prev,
        inspirationImages: Array.from(files),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e, status = "posted") => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (formData.inspirationImages.length) throw new Error("Inspiration image upload is not enabled yet. Remove the files to create the event.");
      const requestBody = { ...formData, inspirationImages: [], guestCount: Number(formData.guestCount), status, services: selectedServices };

      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event request");
      }

      alert(
        status === "draft"
          ? "Event request saved as draft."
          : "Event request posted to vendors."
      );
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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

          <div className="hidden w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search events, vendors or bookings..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-4 text-slate-700 sm:gap-5">
            <Mail size={21} />
            <Bell size={21} />
          </div>
        </header>

        <section className="w-full max-w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl lg:text-4xl">
              Create Event Request
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Define your vision and find the perfect vendors for your next
              premium event.
            </p>
          </div>

          <form
            onSubmit={(e) => handleSubmit(e, "posted")}
            className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_330px]"
          >
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <Card title="Basic Information" icon={<Info size={22} />}>
                <Input
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Annual Tech Summit 2024"
                />

                <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-2">
                  <Select
                    label="Event Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    options={[
                      "Corporate Gala",
                      "Wedding",
                      "Product Launch",
                      "Birthday Party",
                      "Private Party",
                      "Conference",
                    ]}
                  />

                  <Input
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative mt-6">
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter venue or city"
                  />
                  <MapPin
                    size={20}
                    className="absolute bottom-4 right-4 text-slate-400"
                  />
                </div>
              </Card>

              <Card title="Scale & Budget" icon={<WalletCards size={22} />}>
                <div className="grid min-w-0 gap-8 lg:grid-cols-2">
                  <div className="min-w-0">
                    <label className="label">Estimated Guest Count</label>
                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                        className="w-full min-w-0 accent-teal-700"
                      />
                      <span className="w-fit rounded-full bg-teal-100 px-5 py-2 text-sm font-bold text-teal-800">
                        {formData.guestCount}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="label">Budget Range</label>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {["₦100k - ₦500k", "₦500k - ₦2m", "₦2m+"].map((budget) => (
                        <button
                          type="button"
                          key={budget}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              budgetRange: budget,
                            }))
                          }
                          className={`rounded-xl border px-4 py-4 text-sm font-bold ${
                            formData.budgetRange === budget
                              ? "border-teal-700 bg-teal-50 text-teal-800"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          {budget}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Needed Services" icon={<Sparkles size={22} />}>
                <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const active = selectedServices.includes(service.name);

                    return (
                      <button
                        type="button"
                        key={service.name}
                        onClick={() => toggleService(service.name)}
                        className={`rounded-xl border p-5 text-left transition ${
                          active
                            ? "border-teal-700 bg-teal-50 text-teal-900"
                            : "border-slate-200 bg-white text-slate-800 hover:border-teal-300"
                        }`}
                      >
                        <Icon className="text-slate-400" size={24} />
                        <p className="mt-6 font-bold">{service.name}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card title="Details & Inspiration" icon={<Sparkles size={22} />}>
                <div>
                  <label className="label">Specific Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell us more about your theme, atmosphere, or any special requests..."
                    className="mt-3 w-full resize-none rounded-xl border-0 bg-slate-100 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div className="mt-8">
                  <label className="label">Moodboard / Inspiration</label>

                  <label className="mt-3 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-center hover:border-teal-400 sm:min-h-52">
                    <UploadCloud size={34} className="text-teal-800" />
                    <p className="mt-5 font-bold">
                      Click to upload inspiration images
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      PNG, JPG up to 10MB each
                    </p>

                    <input
                      type="file"
                      name="inspirationImages"
                      multiple
                      accept="image/png,image/jpeg"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>

                  {formData.inspirationImages.length > 0 && (
                    <p className="mt-3 text-sm font-semibold text-teal-800">
                      {formData.inspirationImages.length} file(s) selected
                    </p>
                  )}
                </div>
              </Card>

              <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700"
                >
                  Save Draft
                </button>

                <button
                  disabled={loading}
                  type="submit"
                  className="rounded-xl bg-teal-800 px-6 py-4 font-bold text-white shadow-xl shadow-teal-900/20 hover:bg-teal-900 disabled:opacity-70 sm:px-10"
                >
                  {loading ? "Posting..." : "Post Request to Vendors"}
                </button>
              </div>
            </div>

            <aside className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:h-fit">
              <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  Creation Progress
                </p>

                <p className="mt-6 text-sm font-bold">{progress}% Complete</p>

                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-teal-800"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <ProgressItem done={progress >= 25} text="Basic Info" />
                  <ProgressItem done={progress >= 50} text="Budget & Scale" />
                  <ProgressItem done={progress >= 75} text="Services Selected" />
                  <ProgressItem
                    done={progress >= 100}
                    text="Inspiration Details"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="h-28 bg-gradient-to-br from-teal-900 to-slate-800 sm:h-32" />

                <div className="min-w-0 p-5 sm:p-6">
                  <h3 className="break-words text-xl font-bold sm:text-2xl">
                    {formData.title || "Corporate Gala"}
                  </h3>
                  <p className="mt-2 break-words text-sm text-slate-500">
                    {formData.eventDate || "Oct 24, 2024"} •{" "}
                    {formData.location || "New York City"}
                  </p>

                  <PreviewRow
                    label="Estimated Guests"
                    value={`${formData.guestCount} People`}
                  />
                  <PreviewRow label="Total Budget" value={formData.budgetRange} />

                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Requested Services
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedServices.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 sm:p-6">
                <div className="flex gap-4">
                  <Lightbulb size={24} className="shrink-0 text-teal-800" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-teal-900">Pro Tip</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Adding a clear moodboard increases your response rate from
                      high-end vendors. Be as descriptive as possible about your
                      vision.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </section>
      </main>
    </div>
  );
};

const Card = ({ title, icon, children }) => {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800 sm:h-12 sm:w-12">
          {icon}
        </div>
        <h2 className="break-words text-xl font-bold sm:text-2xl">{title}</h2>
      </div>

      {children}
    </section>
  );
};

const Input = ({ label, ...props }) => {
  return (
    <div className="min-w-0">
      <label className="label">{label}</label>
      <input
        {...props}
        className="mt-3 w-full rounded-xl border-0 bg-slate-100 px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700 sm:px-5"
      />
    </div>
  );
};

const Select = ({ label, options, ...props }) => {
  return (
    <div className="min-w-0">
      <label className="label">{label}</label>
      <select
        {...props}
        className="mt-3 w-full rounded-xl border-0 bg-slate-100 px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-700 sm:px-5"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const ProgressItem = ({ done, text }) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        done ? "font-semibold text-teal-800" : "text-slate-400"
      }`}
    >
      <span
        className={`h-3 w-3 shrink-0 rounded-full border ${
          done ? "border-teal-800 bg-teal-800" : "border-slate-300"
        }`}
      />
      <span className="break-words">{text}</span>
    </div>
  );
};

const PreviewRow = ({ label, value }) => {
  return (
    <div className="mt-5 flex flex-col gap-1 border-b border-slate-100 pb-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="wrap-break-word font-bold">{value}</span>
    </div>
  );
};

export default CreateEvent;
