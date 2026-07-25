import { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar.jsx";
import apiRequest from "../../services/api.js";

const VendorMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { apiRequest("/messages/conversations").then((data) => setConversations(data.conversations || [])).catch((requestError) => setError(requestError.message)); }, []);
  const open = async (conversation) => { setActive(conversation); setError(""); try { const data = await apiRequest(`/messages/conversations/${conversation._id}`); setMessages(data.messages || []); } catch (requestError) { setError(requestError.message); } };
  const send = async (event) => { event.preventDefault(); if (!text.trim() || !active) return; setError(""); try { const data = await apiRequest(`/messages/conversations/${active._id}`, { method: "POST", body: { text } }); setMessages((current) => [...current, data.message]); setText(""); } catch (requestError) { setError(requestError.message); } };

  return <div className="min-h-screen bg-slate-50"><VendorSidebar /><main className="px-5 py-8 lg:ml-72 lg:px-10"><h1 className="text-3xl font-black">Messages</h1>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}<div className="mt-8 grid min-h-[65vh] overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-[300px_1fr]"><aside className="border-r border-slate-200 p-4"><h2 className="mb-4 font-black">Conversations</h2>{conversations.length ? conversations.map((conversation) => <button type="button" key={conversation._id} onClick={() => open(conversation)} className={`mb-2 w-full rounded-xl p-4 text-left ${active?._id === conversation._id ? "bg-teal-50" : "hover:bg-slate-50"}`}><p className="font-bold">{conversation.booking?.title || "Direct enquiry"}</p><p className="mt-1 truncate text-xs text-slate-500">{conversation.lastMessage || "No messages yet"}</p></button>) : <p className="text-sm text-slate-500">No conversations yet.</p>}</aside><section className="flex min-h-[65vh] flex-col p-5">{active ? <><div className="flex-1 space-y-3 overflow-y-auto">{messages.map((message) => <article key={message._id} className="rounded-2xl bg-slate-100 p-4"><p className="text-xs font-black text-teal-800">{message.sender?.fullName || "Participant"}</p><p className="mt-1 text-sm text-slate-700">{message.text}</p></article>)}</div><form onSubmit={send} className="mt-4 flex gap-3"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message" maxLength="2000" className="min-w-0 flex-1 rounded-xl border border-slate-300 p-3" /><button className="rounded-xl bg-teal-800 px-5 font-bold text-white">Send</button></form></> : <div className="m-auto text-slate-500">Choose a conversation.</div>}</section></div></main></div>;
};

export default VendorMessages;
