import { apiFetch } from "../../services/api.js";
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Bell,
  Phone,
  MoreVertical,
  Send,
  Plus,
  Smile,
  Info,
  FileText,
  BadgeCheck,
  Menu,
} from "lucide-react";
import UserSidebar from "../../components/users/UserSidebar";
import { useAuth } from "../../context/AuthContext.jsx";

const Messages = ({ initialTab = "messages" }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messageError, setMessageError] = useState("");
  const { user } = useAuth();

  const mapConversation = useCallback((conversation, messages = []) => {
    const other = (conversation.participants || []).find((participant) => participant._id !== user?._id);
    return { ...conversation, vendor: { name: conversation.vendor?.businessName || other?.fullName || "Conversation", avatar: conversation.vendor?.logo || other?.avatar || "/image1.png", online: false },
      project: conversation.booking?.title || "Direct enquiry", preview: conversation.lastMessage || "No messages yet", lastMessageTime: conversation.lastMessageAt,
      messages: messages.map((message) => ({ ...message, sender: message.sender?._id === user?._id ? "user" : "vendor", time: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), seen: (message.readBy || []).length > 1 })),
    };
  }, [user?._id]);

  const openConversation = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    setShowChat(true);
    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations/${conversation._id}`);
      const data = await response.json();
      if (response.ok) setActiveConversation(mapConversation(data.conversation, data.messages || []));
    } catch (requestError) {
      setMessageError(requestError.message || "Unable to load this conversation");
    }
  }, [mapConversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const [response, notificationsResponse] = await Promise.all([
          apiFetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
          apiFetch(`${import.meta.env.VITE_API_URL}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const data = await response.json();
        const notificationData = await notificationsResponse.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load messages");
        }

        const mapped = (data.conversations || []).map((item) => mapConversation(item));
        setConversations(mapped);
        setNotifications(notificationData.notifications || []);
        if (mapped[0]) await openConversation(mapped[0]);
      } catch (error) {
        setConversations([]);
        setActiveConversation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [mapConversation, openConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      sender: "user",
      text: messageText,
      time: "Now",
      seen: false,
    };

    setActiveConversation((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMessage],
    }));

    setMessageText("");

    try {
      const token = localStorage.getItem("token");

      await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/messages/conversations/${activeConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: messageText }),
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-10">
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
              placeholder="Search conversations or vendors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-5 flex items-center gap-5">
            <Bell size={23} className="text-slate-700" />

            <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black">Alexander Thorne</h4>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Elite Member
                </p>
              </div>

              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
                alt="User"
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="flex flex-col lg:grid lg:min-h-[calc(100vh-73px)] lg:grid-cols-[380px_1fr]">
          <aside
            className={`
    border-r border-slate-100 bg-slate-50 px-5 py-8 lg:px-8
    ${showChat ? "hidden lg:block" : "block"}
  `}
          >
            <h1 className="text-3xl font-black">Conversations</h1>

            <div className="mt-8 flex w-fit rounded-full bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("messages")}
                className={`rounded-full px-6 py-2 text-sm font-black uppercase tracking-widest ${
                  activeTab === "messages"
                    ? "bg-teal-800 text-white"
                    : "text-slate-500"
                }`}
              >
                Messages
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`rounded-full px-6 py-2 text-sm font-black uppercase tracking-widest ${
                  activeTab === "notifications"
                    ? "bg-teal-800 text-white"
                    : "text-slate-500"
                }`}
              >
                Notifications
              </button>
            </div>

            {activeTab === "messages" ? (
              <div className="mt-8 space-y-4">
                {conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                      onClick={() => openConversation(conversation)}
                    className={`w-full rounded-2xl p-5 text-left transition ${
                      activeConversation?._id === conversation._id
                        ? "border-l-4 border-teal-800 bg-white shadow-sm"
                        : "hover:bg-white"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={conversation.vendor.avatar}
                          alt={conversation.vendor.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        {conversation.vendor.online && (
                          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <h3 className="line-clamp-2 text-base font-black leading-tight sm:text-lg">
                            {conversation.vendor.name}
                          </h3>
                          <span className="text-sm text-slate-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {conversation.preview}
                        </p>

                        {conversation.badge && (
                          <span
                            className={`mt-3 inline-block rounded-md px-3 py-1 text-xs font-bold ${
                              conversation.badgeType === "warning"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-teal-100 text-teal-800"
                            }`}
                          >
                            {conversation.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <NotificationsPanel notifications={notifications} />
            )}
          </aside>

          <section
            className={`
    flex min-h-[calc(100vh-73px)] flex-col bg-slate-100
    ${showChat ? "block" : "hidden lg:flex"}
  `}
          >
            {activeConversation && (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-6 lg:px-10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowChat(false)}
                      className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
                    >
                      ←
                    </button>
                    <div className="relative">
                      <img
                        src={activeConversation.vendor.avatar}
                        alt={activeConversation.vendor.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      {activeConversation.vendor.online && (
                        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                      )}
                    </div>

                    <div>
                      <h2 className="flex items-center gap-2 text-2xl font-black">
                        {activeConversation.vendor.name}
                        <BadgeCheck size={18} className="text-teal-800" />
                      </h2>
                      <p className="text-sm text-slate-500">
                        Project: {activeConversation.project}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-800 shadow-sm">
                      <Phone size={22} />
                    </button>

                    <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <MoreVertical size={22} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto px-5 py-8 lg:px-12">
                  {activeConversation.notice && (
                    <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 rounded-2xl bg-teal-50 px-6 py-5 text-center text-teal-800">
                      <Info size={24} />
                      <p className="font-medium">{activeConversation.notice}</p>
                    </div>
                  )}

                  {messageError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{messageError}</p>}
                  {activeConversation.messages.map((message) => (
                    <MessageBubble key={message._id} message={message} />
                  ))}

                  {activeConversation.actionCard && (
                    <div className="max-w-xl rounded-3xl border-l-8 border-teal-800 bg-white p-7 shadow-xl">
                      <div className="flex items-start gap-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                          <FileText size={25} />
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-800">
                            Action Required
                          </p>
                          <h3 className="mt-2 text-xl font-black">
                            {activeConversation.actionCard.title}
                          </h3>

                          <p className="mt-5 text-sm leading-6 text-slate-600">
                            {activeConversation.actionCard.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="sticky bottom-0 border-t border-slate-100 bg-slate-100 px-5 py-5 lg:px-12"
                >
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-xl sm:gap-4 sm:px-5 sm:py-4">
                    <button type="button" className="text-slate-600">
                      <Plus size={25} />
                    </button>

                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={`Type your message to ${activeConversation.vendor.name.split(" ")[0]}...`}
                      className="w-full bg-transparent outline-none"
                    />

                    <button type="button" className="text-slate-500">
                      <Smile size={24} />
                    </button>

                    <button
                      type="submit"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white hover:bg-teal-900"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div>
        <div
          className={`max-w-[85%] sm:max-w-xl rounded-3xl px-5 py-4 text-sm sm:px-7 sm:py-5 sm:text-base shadow-sm ${
            isUser
              ? "rounded-br-sm bg-teal-800 text-white"
              : "rounded-bl-sm bg-white text-slate-900"
          }`}
        >
          {message.text}
        </div>

        <p
          className={`mt-2 text-xs text-slate-500 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.time}
          {isUser && message.seen ? " • Seen" : ""}
        </p>
      </div>
    </div>
  );
};

const NotificationsPanel = ({ notifications }) => {
  return (
    <div className="mt-8 space-y-4">
      {notifications.map((item) => (
        <div key={item._id} className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-teal-800">
            {item.type}
          </p>
          <h3 className="mt-2 font-black">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {item.message}
          </p>
          <p className="mt-3 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;
