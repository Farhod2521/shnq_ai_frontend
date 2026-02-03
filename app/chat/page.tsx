import ChatApp from "../components/ChatApp";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <TopBar />
        <ChatApp />
      </div>
    </div>
  );
}
