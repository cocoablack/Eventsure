import { Link } from "react-router-dom";

const NotFound = () => <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
  <p className="text-sm font-black uppercase tracking-[0.3em] text-teal-800">404</p>
  <h1 className="mt-4 text-4xl font-black text-slate-950">Page not found</h1>
  <p className="mt-4 max-w-lg text-slate-600">The page may have moved or the link may be out of date.</p>
  <Link to="/" className="mt-8 rounded-xl bg-teal-800 px-6 py-3 font-bold text-white">Return home</Link>
</main>;

export default NotFound;
